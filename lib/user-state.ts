import { getSupabaseAdmin } from './auth-server';
import { Profile } from './types';

export interface UserState {
  userId: string;
  entitlement: 'locked' | 'unlocked';
  subscriptionStatus: string;
}

export async function getUserState(userId: string): Promise<UserState> {
  const admin = getSupabaseAdmin();
  const { data: profile } = await admin
    .from('profiles')
    .select('user_id, subscription_status')
    .eq('user_id', userId)
    .maybeSingle();

  if (!profile) {
    return {
      userId,
      entitlement: 'locked',
      subscriptionStatus: 'none',
    };
  }

  return {
    userId,
    entitlement: profile.subscription_status === 'os_active' ? 'unlocked' : 'locked',
    subscriptionStatus: profile.subscription_status,
  };
}
