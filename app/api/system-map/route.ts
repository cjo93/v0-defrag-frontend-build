import { NextResponse } from 'next/server';
import { createServerClient, getSupabaseAdmin } from '@/lib/auth-server';
import { buildUserSystemMap } from '@/lib/system-map-engine';

export async function GET() {
  try {
    const supabase = await createServerClient();
    if (!supabase) {
      return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 503 });
    }

    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }

    const map = await buildUserSystemMap(getSupabaseAdmin(), session.user.id);
    return NextResponse.json({ ok: true, ...map });
  } catch (error: any) {
    if (error?.message === 'SUPABASE_MISCONFIGURED') {
      return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 503 });
    }
    console.error('[DEFRAG_API] system-map error:', error);
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 });
  }
}
