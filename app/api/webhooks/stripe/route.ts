import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('[DEFRAG_API] Stripe webhook received');
  return NextResponse.json({ received: true });
}
