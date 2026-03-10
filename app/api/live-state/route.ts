import { NextResponse } from 'next/server';
import { createServerClient, getSupabaseAdmin } from '@/lib/auth-server';

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

    const userId = session.user.id;
    const admin = getSupabaseAdmin();

    const { data, error } = await admin
      .from('people')
      .select('id, relationship_state')
      .eq('owner_user_id', userId);

    if (error) {
      console.error('[DEFRAG_API] live-state query error:', error);
      return NextResponse.json({ ok: false, error: 'query_failed' }, { status: 500 });
    }

    const byState: Record<string, number> = {
      stable: 0,
      strained: 0,
      cooling: 0,
      improving: 0,
      unclear: 0,
    };

    for (const person of data ?? []) {
      const key = person.relationship_state || 'unclear';
      if (Object.prototype.hasOwnProperty.call(byState, key)) byState[key] += 1;
      else byState.unclear += 1;
    }

    return NextResponse.json({ ok: true, total_people: data?.length ?? 0, states: byState });
  } catch (error: any) {
    if (error?.message === 'SUPABASE_MISCONFIGURED') {
      return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 503 });
    }

    console.error('[DEFRAG_API] live-state error:', error);
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 });
  }
}
