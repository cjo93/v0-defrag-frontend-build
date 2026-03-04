import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Lazy-initialize to avoid build-time errors when env vars not set
let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
  return url;
}

function getSupabaseServiceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
  return key;
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
  return key;
}

// Admin client for server-side operations (bypasses RLS)
export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(getSupabaseUrl(), getSupabaseServiceKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _supabaseAdmin;
}

// Legacy export for backwards compatibility
export const supabaseAdmin = {
  from: (table: string) => getSupabaseAdmin().from(table),
};

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
