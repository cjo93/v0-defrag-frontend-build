import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const getSupabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const getSupabaseServiceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Admin client for server-side operations (bypasses RLS)
// Lazy init to prevent build-time crashes
let _adminClient: any = null;
export const getSupabaseAdmin = () => {
  if (!_adminClient) {
    _adminClient = createClient(getSupabaseUrl(), getSupabaseServiceKey(), {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});
  }
  return _adminClient;
};

// Server-side client that respects RLS using user's session
export async function createServerClient() {
  const cookieStore = await cookies();
  
  return createClient(getSupabaseUrl(), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', {
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
