import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key';

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Server-side client that respects RLS using user's session
export async function createServerClient() {
  const cookieStore = await cookies();
  
  return createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key', {
    global: {
      headers: {
        Cookie: cookieStore.toString()
      }
    }
  });
}

/**
 * Extracts and validates user ID from request.
 * Throws UNAUTHORIZED error if missing or invalid.
 */
export async function requireUserId(req: Request): Promise<string> {
  const supabase = await createServerClient();
  
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user?.id) {
    throw new Error('UNAUTHORIZED');
  }

  return session.user.id;
}

export async function getMeStatus() {
  const supabase = await createServerClient();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.user?.id) {
    return {
      profile_ready: false,
      has_relationships: false,
      is_unlocked: false,
    };
  }

  const userId = session.user.id;
  const email = session.user.email;

  const allowlist = ['info@defrag.app', 'chadowen93@gmail.com'];
  let is_unlocked = allowlist.includes(email || '');

  // Check profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('user_id', userId)
    .single();

  if (profile && ['active', 'trialing', 'paid', 'unlocked'].includes(profile.subscription_status)) {
    is_unlocked = true;
  }

  // Check birthline
  const { data: birthline } = await supabase
    .from('birthlines')
    .select('id')
    .eq('user_id', userId)
    .single();

  const profile_ready = !!birthline;

  // Check connections
  const { count: connectionsCount } = await supabase
    .from('connections')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const has_relationships = (connectionsCount || 0) > 0;

  return {
    profile_ready,
    has_relationships,
    is_unlocked,
  };
}
