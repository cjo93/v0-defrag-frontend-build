import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/auth-server';

// Lazy initialization to avoid build-time errors
let _stripe: Stripe | null = null;

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

export async function POST(req: NextRequest) {
  console.log('[DEFRAG_API] POST /api/webhooks/stripe');

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

    console.log('[DEFRAG_API] Webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
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
  const userId = session.metadata?.user_id;
  const plan = session.metadata?.plan || 'solo';

  if (!userId) {
    console.error('[DEFRAG_API] Checkout complete: Missing user_id in metadata');
    return;
  }

  console.log('[DEFRAG_API] Checkout complete for user:', userId, 'plan:', plan);

  // Update profile with subscription info
  const { error } = await supabaseAdmin
    .from('profiles')
    .upsert({
      user_id: userId,
      email: session.customer_email || '',
      plan: plan,
      subscription_status: 'active',
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
    }, {
      onConflict: 'user_id',
    });

  if (error) {
    console.error('[DEFRAG_API] Failed to update profile:', error);
  } else {
    console.log('[DEFRAG_API] Profile updated successfully');
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;
  
  if (!subscriptionId) return;

  // Get subscription to find user
  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.log('[DEFRAG_API] Payment succeeded but no user_id in metadata');
    return;
  }

  console.log('[DEFRAG_API] Payment succeeded for user:', userId);

  await supabaseAdmin
    .from('profiles')
    .update({ subscription_status: 'active' })
    .eq('user_id', userId);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.log('[DEFRAG_API] Subscription updated but no user_id in metadata');
    return;
  }

  const status = mapStripeStatus(subscription.status);
  console.log('[DEFRAG_API] Subscription updated for user:', userId, 'status:', status);

  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_status: status,
      stripe_subscription_id: subscription.id,
    })
    .eq('user_id', userId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.log('[DEFRAG_API] Subscription deleted but no user_id in metadata');
    return;
  }

  console.log('[DEFRAG_API] Subscription deleted for user:', userId);

  await supabaseAdmin
    .from('profiles')
    .update({ subscription_status: 'canceled' })
    .eq('user_id', userId);
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
