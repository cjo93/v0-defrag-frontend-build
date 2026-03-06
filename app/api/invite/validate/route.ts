import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/auth-server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ valid: false, error: 'Missing token' }, { status: 400 });
  }

  const admin = supabaseAdmin;
  if (!admin) {
    return NextResponse.json({ valid: false, error: 'misconfigured' }, { status: 503 });
  }

  const { data: invite, error } = await admin
    .from('invites')
    .select('id, invitee_name, status, expires_at')
    .eq('token', token)
    .single();

  if (error || !invite) {
    return NextResponse.json({ valid: false, error: 'Invite not found' }, { status: 404 });
  }

  if (invite.status !== 'pending') {
    return NextResponse.json({ valid: false, error: 'This invite has already been used' }, { status: 410 });
  }

  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, error: 'This invite has expired' }, { status: 410 });
  }

  return NextResponse.json({
    valid: true,
    invitee_name: invite.invitee_name,
  });
}
