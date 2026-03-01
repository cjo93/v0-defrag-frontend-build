import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
             // The `setAll` method was called from a Server Component.
             // This can be ignored if you have middleware refreshing
             // user sessions.
          }
        },
      },
    }
  );

  await supabase.auth.signOut();

  const url = new URL(req.url);
  return NextResponse.redirect(new URL("/auth/login", url.origin), { status: 303 });
}
