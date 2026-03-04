import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  console.log('[DEFRAG_API] POST /api/invite/submit');

  try {
    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 503 });
    }

    const body = await req.json();
    const {
      token,
      name,
      birth_date,
      birth_time,
      birth_place,
      privacy_level,
      relationship_label,
    } = body;

    // Validate required fields
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!birth_date) {
      return NextResponse.json({ error: 'Birth date is required' }, { status: 400 });
    }

    // Find invite by token
    const { data: invite, error: lookupError } = await admin
      .from('invites')
      .select('*')
      .eq('token', token)
      .single();

    if (lookupError || !invite) {
      console.log('[DEFRAG_API] Invite not found for token');
      return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 404 });
    }

    // Validate invite status
    if (invite.status !== 'pending') {
      return NextResponse.json({ error: 'This invite has already been used' }, { status: 410 });
    }

    // Validate expiration
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      // Mark as expired
      await admin
        .from('invites')
        .update({ status: 'expired' })
        .eq('id', invite.id);

      return NextResponse.json({ error: 'This invite has expired' }, { status: 410 });
    }

    // Determine effective privacy level
    const effectivePrivacy = privacy_level || 'full';

    // Insert person under the inviter's account
    const { data: person, error: personError } = await admin
      .from('people')
      .insert({
        owner_user_id: invite.inviter_user_id,
        invite_id: invite.id,
        name,
        relationship_label: relationship_label || invite.invitee_name || null,
        birth_date,
        birth_time: effectivePrivacy === 'full' ? (birth_time || null) : null,
        birth_place: effectivePrivacy === 'full' ? (birth_place || null) : null,
        privacy_level: effectivePrivacy,
      })
      .select('id')
      .single();

    if (personError) {
      console.error('[DEFRAG_API] Person insert error:', personError);
      return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }

    // Mark invite as completed
    const { error: updateError } = await admin
      .from('invites')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', invite.id);

    if (updateError) {
      console.error('[DEFRAG_API] Invite update error:', updateError);
      // Person was saved, so don't fail the request
    }

    console.log('[DEFRAG_API] Invite submitted:', invite.id, '→ person:', person.id);

    return NextResponse.json({
      ok: true,
      message: 'Thank you — your information has been securely added.',
    });
  } catch (error: any) {
    console.error('[DEFRAG_API] Invite submit error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
