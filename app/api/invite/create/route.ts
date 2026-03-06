import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/auth-server';
import { getSupabaseAdmin } from '@/lib/auth-server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  console.log('[DEFRAG_API] POST /api/invite/create');

  try {
    // Require authenticated user
    const supabase = await createServerClient();
    if (!supabase) {
      return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 503 });
    }

    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Parse request body
    const body = await req.json();
    const { name, relationship_label, contact } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Generate secure token
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Insert invite using admin client (bypasses RLS for server-side write)
    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 503 });
    }

    const { data: invite, error: insertError } = await admin
      .from('invites')
      .insert({
        inviter_user_id: userId,
        token,
        invitee_name: name,
        invitee_contact: contact || null,
        relationship_label: relationship_label || null,
        expires_at: expiresAt.toISOString(),
        status: 'pending',
      })
      .select('id, token, invitee_name, relationship_label, expires_at, status, created_at')
      .single();

    if (insertError) {
      console.error('[DEFRAG_API] Invite insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://defrag.app';
    const inviteLink = `${siteUrl}/invite/${token}`;

    console.log('[DEFRAG_API] Invite created:', invite.id, 'for user:', userId);

    return NextResponse.json({
      ok: true,
      invite: {
        ...invite,
        link: inviteLink,
      },
    });
  } catch (error: any) {
    console.error('[DEFRAG_API] Invite create error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
