import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@/lib/auth-server';
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
    plus: process.env.STRIPE_PLUS_PRICE_ID || '',
  };
}

export async function POST(req: NextRequest) {
  try {
    console.log('[DEFRAG_API] POST /api/checkout');

    const stripe = getStripe();
    const PRICE_IDS = getPriceIds();

    // Get authenticated user
    const supabase = await createServerClient();
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
    const { plan } = body;

    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json({ message: 'Invalid plan' }, { status: 400 });
    }

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json({ message: 'Price not configured for plan' }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://defrag.app';

    // Create Stripe Checkout Session (Stripe-hosted)
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
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
    console.error('[DEFRAG_API] Checkout error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
