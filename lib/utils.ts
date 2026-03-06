import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSiteUrl() {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    (typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '') ?? // Automatically get origin if on client
    'http://localhost:3000'; // Fallback to localhost for dev/server

  if (!url) {
    url = 'http://localhost:3000';
  }

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to not include a trailing slash
  url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url;

  return url;
}
