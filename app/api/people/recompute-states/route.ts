import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, supabaseAdmin } from '@/lib/auth-server';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { updatePersonRelationshipState } from '@/lib/relationship-state';

interface PersonRow {
  id: string;
  relationship_state: string | null;
  relationship_state_updated_at: string | null;
  updated_at: string | null;
}

const MAX_PEOPLE = 100;
const STALE_THRESHOLD_MS = 6 * 60 * 60 * 1000; // 6 hours

/**
 * POST /api/people/recompute-states
 *
 * Recompute relationship_state for stale people owned by the authenticated user.
 * Only recomputes records whose state is older than 6 hours.
 * Parallelized, capped at 100 people per invocation.
 *
 * Rate limited: 3 calls per minute per user.
 */
export async function POST(req: NextRequest) {
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

    // Fetch people with their state timestamp for stale detection
    const { data: people, error: peopleError } = await supabaseAdmin
      .from('people')
      .select('id, relationship_state, relationship_state_updated_at, updated_at')
      .eq('owner_user_id', userId) as { data: PersonRow[] | null; error: any };

    if (peopleError || !people) {
      console.error('[DEFRAG_API] Recompute: failed to fetch people:', peopleError);
      return NextResponse.json({ message: 'Failed to fetch people' }, { status: 500 });
    }

    // Filter to stale records only (state older than 6 hours)
    const now = Date.now();
    const stalePeople = people.filter((p) => {
      const lastUpdated = p.relationship_state_updated_at || p.updated_at;
      if (!lastUpdated) return true; // Never computed → stale
      return now - new Date(lastUpdated).getTime() > STALE_THRESHOLD_MS;
    });

    // Cap to prevent runaway in large accounts
    const peopleToProcess = stalePeople.slice(0, MAX_PEOPLE);

    // Parallelize computation
    const results: { id: string; state: string }[] = [];

    const computed = await Promise.all(
      peopleToProcess.map(async (person) => {
        const state = await updatePersonRelationshipState(supabaseAdmin, person.id, userId);
        return { id: person.id, state };
      })
    );

    results.push(...computed);

    console.log('[DEFRAG_API]', {
      route: 'recompute-states',
      user: userId,
      total: people.length,
      stale: stalePeople.length,
      processed: results.length,
    });

    return NextResponse.json({
      ok: true,
      total: people.length,
      stale: stalePeople.length,
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
