import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, supabaseAdmin } from '@/lib/auth-server';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { updatePersonRelationshipState } from '@/lib/relationship-state';

/**
 * POST /api/people/recompute-states
 *
 * Recompute relationship_state for all people owned by the authenticated user.
 * Used after migrations, first-time dashboard load, or manual refresh.
 *
 * Rate limited: 3 calls per minute per user.
 */
export async function POST(req: NextRequest) {
  console.log('[DEFRAG_API] POST /api/people/recompute-states');

  try {
    const supabase = await createServerClient();
    if (!supabase) {
      return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 503 });
    }

    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Rate limit: 3/min
    const rateLimitResult = checkRateLimit(userId, '/api/people/recompute-states', {
      limit: 3,
      windowMs: 60000,
    });
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { message: 'Too many requests. Please wait a moment.' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // Fetch all people for this user
    const { data: people, error: peopleError } = await supabaseAdmin
      .from('people')
      .select('id')
      .eq('owner_user_id', userId);

    if (peopleError || !people) {
      console.error('[DEFRAG_API] Recompute: failed to fetch people:', peopleError);
      return NextResponse.json({ message: 'Failed to fetch people' }, { status: 500 });
    }

    // Compute state for each person
    const results: { id: string; state: string }[] = [];

    for (const person of people) {
      const state = await updatePersonRelationshipState(supabaseAdmin, person.id, userId);
      results.push({ id: person.id, state });
    }

    console.log(`[DEFRAG_API] Recomputed states for ${results.length} people (user: ${userId})`);

    return NextResponse.json({
      ok: true,
      updated: results.length,
      states: results,
    });
  } catch (error: any) {
    console.error('[DEFRAG_API] Recompute states error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
