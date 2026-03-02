import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-06-20' as any, // Using latest stable available locally or default
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Zod schema for input validation
const checkoutSchema = z.object({
  mode: z.enum(['me', 'dual']),
  data: z.object({
    birthDate: z.string().min(1),
    birthTime: z.string().optional().nullable(),
    birthLocation: z.string().min(1),
    birthCoordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    relationshipType: z.string().optional(),
    theirBirthDate: z.string().optional(),
    theirBirthTime: z.string().optional().nullable(),
    theirBirthLocation: z.string().optional(),
    theirBirthCoordinates: z.object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    }).optional(),
  }),
})

export async function POST(req: Request) {
  try {
    const jsonBody = await req.json()
    const parsed = checkoutSchema.safeParse(jsonBody)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input data', details: parsed.error.issues }, { status: 400 })
    }

    const { mode, data } = parsed.data

    let manual_type = mode === 'me' ? 'individual' : 'relational'
    let payload: any = {
      manual_type,
      status: 'pending_payment',
      precision_badge: data.birthTime ? 'high' : 'standard',
    }

    if (manual_type === 'individual') {
      payload.target_data = {
        birth_date: data.birthDate,
        birth_time: data.birthTime || null,
        birth_location_string: data.birthLocation,
        // Captured coordinates from Google Places API
        coordinates: { lat: data.birthCoordinates.lat, lng: data.birthCoordinates.lng }
      }
    } else {
      payload.relationship_context = data.relationshipType
      payload.primary_data = {
        birth_date: data.birthDate,
        birth_time: data.birthTime || null,
        birth_location_string: data.birthLocation,
        coordinates: { lat: data.birthCoordinates.lat, lng: data.birthCoordinates.lng }
      }
      payload.secondary_data = {
        birth_date: data.theirBirthDate,
        birth_time: data.theirBirthTime || null,
        birth_location_string: data.theirBirthLocation,
        coordinates: { lat: data.theirBirthCoordinates?.lat || 0, lng: data.theirBirthCoordinates?.lng || 0 }
      }
    }

    // 1. Stage in Supabase
    const { data: stagedSession, error } = await supabase
      .from('staged_sessions')
      .insert(payload)
      .select('session_id')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to stage session' }, { status: 500 })
    }

    // 2. Create Stripe Checkout Session
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://defrag.app'

    // In test mode without valid keys, we just mock the redirect for local dev
    if (process.env.STRIPE_SECRET_KEY) {
      const session = await stripe.checkout.sessions.create({
        success_url: `${origin}/manual/${stagedSession.session_id}?verify=true`,
        cancel_url: `${origin}/`,
        payment_method_types: ['card', 'link'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: mode === 'me' ? 'DEFRAG Individual Manual' : 'DEFRAG Relational Manual',
                description: 'Computed structural patterns based on your exact astronomical baseline.',
              },
              unit_amount: 1100, // $11.00
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        metadata: {
          supabase_session_id: stagedSession.session_id,
          manual_type: manual_type,
        },
      })

      return NextResponse.json({ url: session.url })
    } else {
      // Mock for development if no stripe key
      console.warn("No STRIPE_SECRET_KEY, mocking checkout redirect")
      return NextResponse.json({ url: `${origin}/manual/${stagedSession.session_id}?verify=true` })
    }

  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
