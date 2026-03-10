import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const readEnv = (key: string): string | undefined => {
  const value = process.env[key];
  if (!value || value === 'placeholder' || value === 'placeholder-key' || value === 'placeholder-anon-key') {
    return undefined;
  }
  return value;
};

const getSupabaseUrl = () => readEnv('NEXT_PUBLIC_SUPABASE_URL');
const getSupabaseAnonKey = () => readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const getSupabaseServiceKey = () => readEnv('SUPABASE_SERVICE_ROLE_KEY');

export const isSupabaseConfigured = (): boolean => {
  return !!getSupabaseUrl() && !!getSupabaseAnonKey() && !!getSupabaseServiceKey();
};

let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey();

  if (!url || !serviceKey) {
    throw new Error('SUPABASE_MISCONFIGURED');
  }

  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return _supabaseAdmin;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const admin = getSupabaseAdmin() as any;
    return admin[prop];
  },
}) as SupabaseClient;

export async function createServerClient(): Promise<SupabaseClient | null> {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!url || !anonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createClient(url, anonKey, {
    global: {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  });
}

export async function requireUserId(_req: Request): Promise<string> {
  const supabase = await createServerClient();
  if (!supabase) {
    throw new Error('SUPABASE_MISCONFIGURED');
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    throw new Error('UNAUTHORIZED');
  }

  return session.user.id;
}
