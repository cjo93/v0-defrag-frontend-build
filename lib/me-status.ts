import { createServerClient } from './auth-server';

export async function getMeStatus() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      profile_ready: false,
      has_relationships: false,
      is_unlocked: false,
    };
  }

  const [profileResult, birthlinesResult, connectionsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single(),
    supabase
      .from('birthlines')
      .select('id')
      .eq('user_id', user.id)
      .limit(1),
    supabase
      .from('connections')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
  ]);

  const profileReady = birthlinesResult.data && birthlinesResult.data.length > 0;
  const hasRelationships = connectionsResult.count !== null && connectionsResult.count > 0;

  const validStatuses = ['active', 'trialing', 'paid', 'unlocked'];
  let isUnlocked = false;

  if (profileResult.data?.subscription_status && validStatuses.includes(profileResult.data.subscription_status)) {
    isUnlocked = true;
  }

  if (user.email && ['info@defrag.app', 'chadowen93@gmail.com'].includes(user.email)) {
    isUnlocked = true;
  }

  return {
    profile_ready: profileReady,
    has_relationships: hasRelationships,
    is_unlocked: isUnlocked,
  };
}
