import { NextResponse } from 'next/server';

export async function GET() {
  console.log('[DEFRAG_API] Health check requested');
  return NextResponse.json({ status: 'ok' });
}
