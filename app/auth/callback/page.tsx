"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase client detects the hash fragment and exchanges it for a session
    // Once session is ready, redirect to dashboard
    if (!supabase) {
      router.replace("/auth/login");
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.replace("/onboarding");
      }
    });

    // Fallback: if session already exists after a short delay, redirect anyway
    const timeout = setTimeout(() => {
      router.replace("/onboarding");
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased flex items-center justify-center p-6">
      <div className="text-center space-y-4 animate-fade-in">
        <p className="font-mono text-[13px] font-semibold tracking-[0.2em]">DEFRAG</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Signing you in…</p>
      </div>
    </div>
  );
}
