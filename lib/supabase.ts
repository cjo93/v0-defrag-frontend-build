import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

const isConfigured = !!supabaseUrl && !!supabaseAnonKey;

// Production: strict enforcement. Preview/dev: optional with warning
if (!isConfigured && isProduction) {
  throw new Error(
    'Missing Supabase configuration in production. NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.'
  );
}

if (!isConfigured) {
  console.warn('[Auth] Supabase not configured - auth features disabled in preview');
}

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Auth helpers - with preview environment guards
export async function sendMagicLink(email: string) {
  if (!supabase) {
    throw new Error('Authentication is not configured');
  }
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/connect?step=context`,
    },
  });
  
  if (error) throw error;
}

export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
