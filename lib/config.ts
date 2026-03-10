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
