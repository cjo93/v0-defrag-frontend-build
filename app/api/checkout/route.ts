import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('[DEFRAG_API] Checkout request received');
  return NextResponse.json({ message: 'Checkout simulated' });
}
