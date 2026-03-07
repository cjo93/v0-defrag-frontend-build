import { createServerClient } from '@/lib/auth-server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/onboarding';

  if (code) {
    const supabase = await createServerClient();

    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      } else {
        console.error('[Auth Callback] error exchanging code for session:', error.message);
      }
    }
  } else {
     console.error('[Auth Callback] no code provided in query string');
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(new URL('/auth/login?error=true', request.url));
}
