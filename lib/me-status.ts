import { createServerClient, supabaseAdmin } from './auth-server';
import type { UserStatus, Plan, SubscriptionStatus } from './supabase/types';

// Email allowlist for forced plus unlock
const ALLOWLIST_EMAILS = [
  'info@defrag.app',
  'chadowen93@gmail.com',
];

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
    const userEmail = session.user.email || '';

    // Check allowlist for forced plus unlock
    const isAllowlisted = ALLOWLIST_EMAILS.includes(userEmail.toLowerCase());

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, subscription_status, email')
      .eq('user_id', userId)
      .single();

    // Fetch birthline
    const { data: birthline } = await supabase
      .from('birthlines')
      .select('id')
      .eq('user_id', userId)
      .single();

    // Count connections
    const { count: connectionCount } = await supabase
      .from('connections')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    const plan: Plan = profile?.plan || 'solo';
    const subscriptionStatus: SubscriptionStatus = profile?.subscription_status || 'pending';

    // Determine unlock states
    const isActiveSubscription = ['active', 'trialing', 'unlocked'].includes(subscriptionStatus);
    const isSoloUnlocked = isAllowlisted || isActiveSubscription;
    const isPlusUnlocked = isAllowlisted || (plan === 'plus' && isActiveSubscription);

    return {
      profile_ready: !!profile,
      has_birthline: !!birthline,
      has_relationships: (connectionCount || 0) > 0,
      is_solo_unlocked: isSoloUnlocked,
      is_plus_unlocked: isPlusUnlocked,
      plan: isAllowlisted ? 'plus' : plan,
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
  if (!status.is_solo_unlocked) {
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
        plan: 'solo',
        subscription_status: 'pending',
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: true,
      });
  } catch (error) {
    console.error('[DEFRAG_API] ensureProfile error:', error);
  }
}
