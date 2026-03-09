"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState('/onboarding');

  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = new URLSearchParams(window.location.search).get("next");
    if (next && next.startsWith("/")) setNextPath(next);
  }, []);

  useEffect(() => {
    if (!supabase) {
      router.replace(`/auth/login?next=${encodeURIComponent(nextPath)}`);
      return;
    }

    const sb = supabase;

    const settle = async () => {
      const { data: { session } } = await sb.auth.getSession();
      if (session) {
        router.replace(nextPath);
      }
    };

    settle();

    const { data: { subscription } } = sb.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        router.replace(nextPath);
      }
    });

    const timeout = setTimeout(() => {
      router.replace(nextPath);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router, nextPath]);

  return (
    <div className="min-h-screen bg-transparent text-white font-sans antialiased flex items-center justify-center p-6">
      <div className="text-center space-y-4 animate-fade-in">
        <p className="font-mono text-[13px] font-semibold tracking-[0.2em]">DEFRAG</p>
        <div className="flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-typing-dot" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-typing-dot delay-150" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-typing-dot delay-320" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Signing you in</p>
      </div>
    </div>
  );
}
