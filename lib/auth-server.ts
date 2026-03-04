import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Deploy-safe: never throw at module scope or during build.
// All getters return null if env vars are missing.

let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || null;
}

function getSupabaseServiceKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

function getSupabaseAnonKey(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;
}

// Admin client for server-side operations (bypasses RLS)
// Returns null if env vars are missing.
export function getSupabaseAdmin(): SupabaseClient | null {
  if (_supabaseAdmin) return _supabaseAdmin;

  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey();
  if (!url || !key) {
    console.warn('[Auth] Supabase admin not configured — missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return null;
  }

  _supabaseAdmin = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return _supabaseAdmin;
}

// Legacy proxy — returns a no-op stub if admin client is unavailable.
const noopFrom = () => ({
  select: () => ({ eq: () => ({ single: () => ({ data: null, error: { message: 'Supabase not configured' } }) }), data: null, error: { message: 'Supabase not configured' } }),
  insert: () => ({ select: () => ({ single: () => ({ data: null, error: { message: 'Supabase not configured' } }) }), data: null, error: { message: 'Supabase not configured' } }),
  update: () => ({ eq: () => ({ data: null, error: { message: 'Supabase not configured' } }) }),
  upsert: (_vals: any, _opts?: any) => ({ data: null, error: { message: 'Supabase not configured' } }),
  delete: () => ({ eq: () => ({ data: null, error: { message: 'Supabase not configured' } }) }),
});

export const supabaseAdmin = {
  from: (table: string) => {
    const admin = getSupabaseAdmin();
    if (!admin) return noopFrom() as any;
    return admin.from(table);
  },
};

// Server-side client that respects RLS using user's session.
// Returns null if env vars are missing.
export async function createServerClient(): Promise<SupabaseClient | null> {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) {
    console.warn('[Auth] Supabase server client not configured — missing env vars');
    return null;
  }

  const cookieStore = await cookies();
  
  return createClient(url, anonKey, {
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
  
  if (!supabase) {
    throw new Error('UNAUTHORIZED');
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user?.id) {
    throw new Error('UNAUTHORIZED');
  }

  return session.user.id;
}
