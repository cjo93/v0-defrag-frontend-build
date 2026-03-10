// lib/config.ts
const readEnv = (k: string): string | undefined => {
  const v = process.env[k];
  if (!v) return undefined;
  if (v === 'placeholder' || v === 'placeholder-key' || v === 'placeholder-anon-key') return undefined;
  return v;
};

export const USE_EXTERNAL_API = readEnv('USE_EXTERNAL_API') === 'true';
export const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const EXTERNAL_API = readEnv('API_EXTERNAL_BASE') || 'https://api.defrag.app';
const INTERNAL_API = readEnv('INTERNAL_API_BASE') || '';

export function getServerApiBase() {
  return USE_EXTERNAL_API ? EXTERNAL_API : (INTERNAL_API || '');
}

export function getClientApiBase() {
  return NEXT_PUBLIC_API_BASE_URL || '';
}

function hasSupabaseConfig() {
  return !!(
    readEnv('SUPABASE_URL') ||
    readEnv('NEXT_PUBLIC_SUPABASE_URL')
  ) && !!(
    readEnv('SUPABASE_ANON_KEY') ||
    readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  );
}

export function getMissingRequiredServerEnv(): string[] {
  const missing: string[] = [];

  if (!readEnv('NEXT_PUBLIC_SITE_URL')) {
    missing.push('NEXT_PUBLIC_SITE_URL');
  }
  if (!readEnv('STRIPE_SECRET_KEY')) {
    missing.push('STRIPE_SECRET_KEY');
  }
  if (!readEnv('STRIPE_WEBHOOK_SECRET')) {
    missing.push('STRIPE_WEBHOOK_SECRET');
  }
  if (!readEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')) {
    missing.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  }
  if (!hasSupabaseConfig()) {
    missing.push('SUPABASE_URL|NEXT_PUBLIC_SUPABASE_URL');
    missing.push('SUPABASE_ANON_KEY|NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return missing;
}

export function assertRequiredServerEnv() {
  const missing = getMissingRequiredServerEnv();
  if (missing.length > 0) {
    throw new Error(`MISSING_ENV:${missing.join(',')}`);
  }
}
