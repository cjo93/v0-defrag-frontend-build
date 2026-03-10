import { createServerClient, supabaseAdmin } from './auth-server';
import type { UserStatus, Plan, SubscriptionStatus } from './supabase/types';
import { canonicalPlan, hasPaidAccess } from './plan-label';

// Email allowlist for forced team unlock
const ALLOWLIST_EMAILS = [
  'info@defrag.app',
  'chadowen93@gmail.com',
].map(e => e.toLowerCase());

/**
 * Get user status for routing decisions.
 * Server-only function - do not import in client components.
 */
export async function getUserStatus(): Promise<UserStatus | null> {
  try {
    const supabase = await createServerClient();
    if (!supabase) return null;
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return null;
    }

    const userId = session.user.id;
    const userEmail = (session.user.email || '').toLowerCase();

    // Check allowlist for forced team unlock
    const isAllowlisted = ALLOWLIST_EMAILS.includes(userEmail);

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, subscription_status, email')
      .eq('user_id', userId)
      .maybeSingle();

    // Fetch birthline
    const { data: birthline } = await supabase
      .from('birthlines')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    // Count connections
    const { count: connectionCount } = await supabase
      .from('connections')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    const plan: Plan = canonicalPlan(profile?.plan || 'free');
    const subscriptionStatus: SubscriptionStatus = profile?.subscription_status || 'pending';

    // Determine unlock states
    const paidAccess = hasPaidAccess(plan, subscriptionStatus);
    const isFreeOrAbove = plan === 'free' || paidAccess;
    const isSoloUnlocked = isAllowlisted || paidAccess;
    const isTeamUnlocked = isAllowlisted || (plan === 'team' && paidAccess);

    return {
      profile_ready: !!profile,
      has_birthline: !!birthline,
      has_relationships: (connectionCount ?? 0) > 0,
      is_free_unlocked: isAllowlisted || isFreeOrAbove,
      is_solo_unlocked: isSoloUnlocked,
      is_team_unlocked: isTeamUnlocked,
      plan: isAllowlisted ? 'team' : plan,
      subscription_status: isAllowlisted ? 'unlocked' : subscriptionStatus,
    };
  } catch (error) {
    console.error('[DEFRAG_API] getUserStatus error:', error);
    return null;
  }
}

/**
 * Determine the correct redirect path based on user status.
 */
export function getRedirectPath(status: UserStatus | null): string {
  // Not authenticated
  if (!status) {
    return '/auth/login';
  }

  // No birthline → onboarding
  if (!status.has_birthline) {
    return '/onboarding';
  }

  // Has birthline but not unlocked → unlock screen
  if (!status.is_free_unlocked && !status.is_solo_unlocked) {
    return '/unlock';
  }

  // Unlocked → dashboard
  return '/dashboard';
}

/**
 * Ensure profile exists for user (upsert pattern).
 * Use when profile might not exist yet.
 */
export async function ensureProfile(userId: string, email: string): Promise<void> {
  try {
    await supabaseAdmin
      .from('profiles')
      .upsert({
        user_id: userId,
        email,
        plan: 'free',
        subscription_status: 'pending',
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: true,
      });
  } catch (error) {
    console.error('[DEFRAG_API] ensureProfile error:', error);
  }
}
