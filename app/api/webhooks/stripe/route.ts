import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Next.js statically analyzes files during build, so we need to mock Stripe
// initialization if keys are not present in environment variables.
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20' as any,
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: Request) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret || '')
  } catch (err: any) {
    console.error(`[DEFRAG_API] Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

    console.log(`[DEFRAG_API] stripe webhook received: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const sessionId = session.metadata?.supabase_session_id;

      console.log('[DEFRAG_API] checkout completed', { sessionId });

      if (sessionId) {
        // Update status to unlocked
        const { error } = await supabase
          .from('staged_sessions')
          .update({ status: 'unlocked' })
          .eq('session_id', sessionId);

        if (error) {
          console.error('[DEFRAG_API] Failed to unlock session:', error);
        } else {
          console.log(`[DEFRAG_API] Session ${sessionId} unlocked via Stripe webhook.`);
        }
      }
      break;
    }
    case 'invoice.payment_succeeded': {
      console.log('[DEFRAG_API] invoice payment succeeded');
      // Sync subscription state logic
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      console.log(`[DEFRAG_API] subscription event: ${event.type}`);
      // Sync subscription state logic
      break;
    }
    default:
      console.log(`[DEFRAG_API] Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true })
}
