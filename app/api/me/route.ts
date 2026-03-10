import { NextResponse } from 'next/server';
import { getUserStatus } from '@/lib/me-status';

export async function GET() {
  try {
    const status = await getUserStatus();
    if (!status) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    return NextResponse.json({
      has_profile: status.profile_ready,
      chart_generated: status.has_birthline,
      is_solo_unlocked: status.is_solo_unlocked,
      is_team_unlocked: status.is_team_unlocked,
      plan: status.plan,
      subscription_status: status.subscription_status,
    });
  } catch (error) {
    console.error('[DEFRAG_API] /api/me error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
