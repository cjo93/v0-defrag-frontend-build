import { NextResponse } from 'next/server';
import { createServerClient, supabaseAdmin } from '@/lib/auth-server';

export async function GET() {
  try {
    const supabase = await createServerClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Service misconfigured' }, { status: 503 });
    }

    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const { data, error } = await supabaseAdmin
      .from('people')
      .select('id, relationship_state')
      .eq('owner_user_id', userId);

    if (error) {
      console.error('[DEFRAG_API] live-state query error:', error);
      return NextResponse.json({ error: 'Failed to load live state' }, { status: 500 });
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

    return NextResponse.json({ total_people: data?.length ?? 0, states: byState });
  } catch (error) {
    console.error('[DEFRAG_API] live-state error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
