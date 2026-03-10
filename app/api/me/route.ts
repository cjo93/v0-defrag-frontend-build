import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/auth-server';
import { getUserStatus } from '@/lib/me-status';
import { hasPaidAccess } from '@/lib/plan-label';

export async function GET() {
  try {
    const status = await getUserStatus();
    if (!status) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const base = {
      plan: status.plan,
      subscription_status: status.subscription_status,
      has_paid_access: hasPaidAccess(status.plan, status.subscription_status),
    };

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(base);
    }

    const supabase = await createServerClient();
    const {
      data: { session },
    } = supabase ? await supabase.auth.getSession() : { data: { session: null } };

    let stripe_customer_id: string | null = null;
    let stripe_subscription_id: string | null = null;
    if (supabase && session?.user?.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id, stripe_subscription_id')
        .eq('user_id', session.user.id)
        .maybeSingle();
      stripe_customer_id = profile?.stripe_customer_id ?? null;
      stripe_subscription_id = profile?.stripe_subscription_id ?? null;
    }

    return NextResponse.json({
      ...base,
      has_profile: status.profile_ready,
      chart_generated: status.has_birthline,
      is_solo_unlocked: status.is_solo_unlocked,
      is_team_unlocked: status.is_team_unlocked,
      stripe_customer_id,
      stripe_subscription_id,
    });
  } catch (error) {
    console.error('[DEFRAG_API] /api/me error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
