import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getSupabaseAdmin } from '@/lib/auth-server';
import { getUserState } from '@/lib/user-state';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { generateDailyBriefing } from '@/lib/generate-daily-briefing';

/**
 * GET /api/daily-briefing
 *
 * Returns the daily relational briefing for the authenticated user.
 * Generates once per day, cached after first call.
 *
 * Rate limited: 5 calls per minute per user.
 */
export async function GET(req: NextRequest) {
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
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const userId = session.user.id;

    // Enforce entitlement
    const userState = await getUserState(userId);
    if (userState.entitlement !== 'unlocked') {
      return NextResponse.json(
        { ok: false, message: 'Premium feature locked. Upgrade required.' },
        { status: 402 }
      );
    }

    const rateLimitResult = checkRateLimit(userId, '/api/daily-briefing', {
      limit: 5,
      windowMs: 60000,
    });
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { ok: false, message: 'Too many requests.' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const admin = getSupabaseAdmin();
    const summary = await generateDailyBriefing(admin, userId);

    return NextResponse.json({
      ok: true,
      summary: summary || null,
      date: new Date().toISOString().slice(0, 10),
    });
  } catch (error: any) {
    if (error?.message === 'SUPABASE_MISCONFIGURED') {
      return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 503 });
    }

    console.error('[DEFRAG_API] Daily briefing error:', error);
    return NextResponse.json(
      { ok: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
