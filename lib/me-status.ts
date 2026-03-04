import { supabaseAdmin, requireUserId } from './auth-server';

export async function getMeStatus(req?: Request) {
  try {
    const userId = await requireUserId(req);

    const [{ data: profile }, { count: birthlinesCount }, { count: connectionsCount }] = await Promise.all([
      supabaseAdmin.from('profiles').select('email, subscription_status').eq('user_id', userId).single(),
      supabaseAdmin.from('birthlines').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabaseAdmin.from('connections').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    ]);

    const profile_ready = (birthlinesCount ?? 0) > 0;
    const has_relationships = (connectionsCount ?? 0) > 0;

    const unlockedStatuses = ['active', 'trialing', 'paid', 'unlocked'];
    const unlockedEmails = ['info@defrag.app', 'chadowen93@gmail.com'];

    let is_unlocked = false;
    if (profile) {
      if (
        (profile.subscription_status && unlockedStatuses.includes(profile.subscription_status)) ||
        (profile.email && unlockedEmails.includes(profile.email))
      ) {
        is_unlocked = true;
      }
    }

    return {
      profile_ready,
      has_relationships,
      is_unlocked
    };
  } catch (err) {
    console.error('getMeStatus error:', err);
    return {
      profile_ready: false,
      has_relationships: false,
      is_unlocked: false
    };
  }
}
