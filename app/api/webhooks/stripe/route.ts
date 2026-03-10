import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/auth-server';
import { assertRequiredServerEnv } from '@/lib/config';
import { canonicalPlan } from '@/lib/plan-label';
import { logBillingEvent } from '@/lib/billing-observability';

// Lazy initialization to avoid build-time errors
let _stripe: Stripe | null = null;
const processedEventIds = new Set<string>();
const MAX_EVENT_CACHE = 500;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is required');
    _stripe = new Stripe(key);
  }
  return _stripe;
}

function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is required');
  return secret;
}

async function resolveUserIdByStripeCustomer(customerId: string | null): Promise<string | null> {
  if (!customerId) return null;
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
  return profile?.user_id ?? null;
}

type ProfilePatch = {
  plan?: 'free' | 'solo' | 'team';
  subscription_status?: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  email?: string;
};

async function patchProfileIfChanged(userId: string, patch: ProfilePatch): Promise<void> {
  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('plan, subscription_status, stripe_customer_id, stripe_subscription_id, email')
    .eq('user_id', userId)
    .maybeSingle();

  const changed =
    !existing ||
    (patch.plan !== undefined && existing.plan !== patch.plan) ||
    (patch.subscription_status !== undefined && existing.subscription_status !== patch.subscription_status) ||
    (patch.stripe_customer_id !== undefined && existing.stripe_customer_id !== patch.stripe_customer_id) ||
    (patch.stripe_subscription_id !== undefined && existing.stripe_subscription_id !== patch.stripe_subscription_id) ||
    (patch.email !== undefined && existing.email !== patch.email);

  if (!changed) return;

  await supabaseAdmin
    .from('profiles')
    .upsert({ user_id: userId, ...patch }, { onConflict: 'user_id' });

  logBillingEvent({
    event_type: 'subscription_status_updated',
    user_id: userId,
    plan: patch.plan ?? existing?.plan ?? null,
    subscription_status: patch.subscription_status ?? existing?.subscription_status ?? null,
    stripe_customer_id: patch.stripe_customer_id ?? existing?.stripe_customer_id ?? null,
  });
}

async function markEventIfNew(eventId: string): Promise<boolean> {
  if (processedEventIds.has(eventId)) return false;
  processedEventIds.add(eventId);
  if (processedEventIds.size > MAX_EVENT_CACHE) {
    const first = processedEventIds.values().next().value;
    if (first) processedEventIds.delete(first);
  }

  const { error } = await supabaseAdmin
    .from('stripe_events')
    .insert({ event_id: eventId, processed_at: new Date().toISOString() });

  if (!error) return true;

  // Table might not exist yet in every environment. Keep in-memory safety regardless.
  if (error.code === '42P01') return true;
  // Duplicate key from persistent ledger.
  if (error.code === '23505') return false;
  return true;
}

export async function POST(req: NextRequest) {
  console.log('[DEFRAG_API] POST /api/webhooks/stripe');

  try {
    assertRequiredServerEnv();
  } catch {
    return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 503 });
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[DEFRAG_API] Webhook: missing STRIPE env group');
    return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 503 });
  }

  const stripe = getStripe();
  const webhookSecret = getWebhookSecret();

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('[DEFRAG_API] Webhook: Missing signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('[DEFRAG_API] Webhook signature verification failed:', errorMessage);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    logBillingEvent({
      event_type: 'webhook_event_received',
      stripe_event_id: event.id,
      stripe_event_type: event.type,
    });

    const relevantEventTypes = new Set([
      'checkout.session.completed',
      'customer.subscription.updated',
      'customer.subscription.deleted',
    ]);
    if (!relevantEventTypes.has(event.type)) {
      return NextResponse.json({ received: true, skipped: true });
    }

    const isNewEvent = await markEventIfNew(event.id);
    if (!isNewEvent) {
      logBillingEvent({
        event_type: 'webhook_event_received',
        stripe_event_id: event.id,
        stripe_event_type: event.type,
        duplicate: true,
      });
      return NextResponse.json({ received: true, duplicate: true });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log('[DEFRAG_API] Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[DEFRAG_API] Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId =
    session.metadata?.user_id ||
    await resolveUserIdByStripeCustomer(typeof session.customer === 'string' ? session.customer : null);
  const plan = canonicalPlan(session.metadata?.plan || 'solo');

  if (!userId) {
    console.error('[DEFRAG_API] Checkout complete: Missing user_id in metadata');
    return;
  }

  console.log('[DEFRAG_API] Checkout complete for user:', userId, 'plan:', plan);

  const profileUpdate: ProfilePatch = {
    plan,
    subscription_status: 'active',
    stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
    stripe_subscription_id: typeof session.subscription === 'string' ? session.subscription : null,
  };
  if (session.customer_email) {
    profileUpdate.email = session.customer_email;
  }

  try {
    await patchProfileIfChanged(userId, profileUpdate);
    console.log('[DEFRAG_API] Profile updated successfully');
  } catch (error) {
    console.error('[DEFRAG_API] Failed to update profile:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id || await resolveUserIdByStripeCustomer(
    typeof subscription.customer === 'string' ? subscription.customer : null
  );

  if (!userId) {
    console.log('[DEFRAG_API] Subscription updated but no user_id in metadata');
    return;
  }

  const status = mapStripeStatus(subscription.status);
  console.log('[DEFRAG_API] Subscription updated for user:', userId, 'status:', status);

  await patchProfileIfChanged(userId, {
    plan: canonicalPlan(subscription.metadata?.plan || 'free'),
    subscription_status: status,
    stripe_subscription_id: subscription.id,
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id || await resolveUserIdByStripeCustomer(
    typeof subscription.customer === 'string' ? subscription.customer : null
  );

  if (!userId) {
    console.log('[DEFRAG_API] Subscription deleted but no user_id in metadata');
    return;
  }

  console.log('[DEFRAG_API] Subscription deleted for user:', userId);

  await patchProfileIfChanged(userId, { subscription_status: 'canceled' });
}

function mapStripeStatus(stripeStatus: string): string {
  switch (stripeStatus) {
    case 'active':
      return 'active';
    case 'trialing':
      return 'trialing';
    case 'canceled':
    case 'unpaid':
    case 'incomplete_expired':
      return 'canceled';
    default:
      return 'pending';
  }
}
