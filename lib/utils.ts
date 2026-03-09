import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSiteUrl() {
  const envUrl = process?.env?.NEXT_PUBLIC_SITE_URL?.trim();
  const browserOrigin = typeof window !== 'undefined' ? window.location?.origin : '';

  let url = envUrl || browserOrigin || '';

  if (!url) {
    url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://defrag.app';
  }

  url = url.includes('http') ? url : `https://${url}`;
  return url.endsWith('/') ? url.slice(0, -1) : url;
}
