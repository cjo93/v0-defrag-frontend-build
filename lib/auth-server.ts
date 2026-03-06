import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const getSupabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const getSupabaseServiceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';
const getSupabaseAnonKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(getSupabaseUrl(), getSupabaseServiceKey(), {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Server-side client that respects RLS using user's session
export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    global: {
      headers: {
        Cookie: cookieStore.toString()
      }
    }
  });
}

// Helper to assert user is authenticated
export async function requireUserId(req: Request): Promise<string> {
  const supabase = await createServerClient();
  
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    throw new Error('UNAUTHORIZED');
  }

  return session.user.id;
}
