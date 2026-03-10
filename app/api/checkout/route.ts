import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@/lib/auth-server';
import { assertRequiredServerEnv } from '@/lib/config';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

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

// Price IDs - configure these in Stripe Dashboard
function getPriceIds(): Record<string, string> {
  return {
    solo: process.env.STRIPE_SOLO_PRICE_ID || '',
    team: process.env.STRIPE_PLUS_PRICE_ID || '',
  };
}

function canonicalizePlan(rawPlan: unknown): 'free' | 'solo' | 'team' {
  if (rawPlan === 'blueprint') return 'solo';
  if (rawPlan === 'os') return 'team';
  if (rawPlan === 'solo' || rawPlan === 'team' || rawPlan === 'free') return rawPlan;
  return 'free';
}

export async function POST(req: NextRequest) {
  try {
    console.log('[DEFRAG_API] POST /api/checkout');

    assertRequiredServerEnv();

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('[DEFRAG_API] Checkout: missing STRIPE env group');
      return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 503 });
    }

    const stripe = getStripe();
    const PRICE_IDS = getPriceIds();

    // Get authenticated user
    const supabase = await createServerClient();
    if (!supabase) {
      console.error('[DEFRAG_API] Checkout: missing SUPABASE env group');
      return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 503 });
    }
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      console.log('[DEFRAG_API] Checkout: Unauthorized');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Rate limiting (5/min per user)
    const rateLimitResult = checkRateLimit(userId, '/api/checkout');
    if (!rateLimitResult.allowed) {
      console.log('[DEFRAG_API] Checkout: Rate limited for user:', userId);
      return NextResponse.json(
        { message: 'Too many requests. Please wait a moment.' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // Parse request body
    const body = await req.json();
    const plan = canonicalizePlan(body?.plan);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://defrag.app';

    if (plan === 'free') {
      return NextResponse.json({ url: `${siteUrl}/dashboard?plan=free`, plan: 'free' });
    }

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 503 });
    }

    // Create Stripe Checkout Session (Stripe-hosted)
    // Omitting payment_method_types allows Stripe to auto-show
    // Card, Apple Pay, Google Pay, and Link based on device/region
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      success_url: `${siteUrl}/unlock/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/unlock?canceled=1`,
      metadata: {
        user_id: userId,
        plan: plan,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          plan: plan,
        },
      },
    });

    console.log('[DEFRAG_API] Checkout session created:', checkoutSession.id);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    if (typeof error?.message === 'string' && error.message.startsWith('MISSING_ENV:')) {
      return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 503 });
    }
    console.error('[DEFRAG_API] Checkout error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
