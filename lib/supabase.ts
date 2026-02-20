import { createClient } from '@supabase/supabase-js';

// Use placeholder values if env vars are not set (for development/preview)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Auth helpers
export async function sendMagicLink(email: string) {
  if (!isConfigured) {
    throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
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
  if (!isConfigured) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  if (!isConfigured) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  if (!isConfigured) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
