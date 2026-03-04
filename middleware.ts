import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Routes that require authentication
  const protectedRoutes = ['/dashboard', '/onboarding', '/settings', '/relationships', '/unlock', '/chat'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Heuristic session check via cookies (edge-compatible, no DB call)
  const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || '';
  const hasSession =
    req.cookies.has(`sb-${projectRef}-auth-token`) ||
    req.cookies.has('supabase-auth-token') ||
    Array.from(req.cookies.getAll()).some(c => c.name.includes('auth-token'));

  if (!hasSession) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated — allow through. Client-side pages enforce onboarding/unlock gating.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth|invite).*)',
  ],
};
