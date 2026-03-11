"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verified, setVerified] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [plan, setPlan] = useState('free');
  const [subscriptionStatus, setSubscriptionStatus] = useState('none');

  // Poll for payment verification before allowing redirect
  useEffect(() => {
    if (!sessionId) {
      router.replace("/unlock");
      return;
    }

    // Signal dashboard to show confirmation banner
    try { localStorage.setItem('defrag_plan_activated', 'true'); } catch {}

    let cancelled = false;
    const poll = async () => {
      for (let i = 0; i < 20; i++) {
        if (cancelled) return;
        try {
          const res = await fetch('/api/me');
          if (res.ok) {
            const data = await res.json();
            setPlan(data.plan || 'free');
            setSubscriptionStatus(data.subscription_status || 'none');
            if (data.is_solo_unlocked) {
              setVerified(true);
              return;
            }
          }
        } catch {}
        await new Promise(r => setTimeout(r, 1500));
      }
      // After 30s of polling, show fallback — webhook may be slow
      setTimedOut(true);
      setVerified(true);
    };
    poll();
    return () => { cancelled = true; };
  }, [sessionId, router]);

  // Countdown only starts after verified
  useEffect(() => {
    if (!verified) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [verified, router]);

  if (!sessionId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent text-white font-sans antialiased flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[440px] text-center space-y-8">
        <CheckCircle className="w-14 h-14 text-white/60 mx-auto" />

        <div className="space-y-3">
          <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Subscription active</p>
          <h1 className="text-[26px] md:text-[36px] font-normal tracking-[-0.015em]">You&apos;re in</h1>
          {timedOut ? (
            <p className="text-[14px] md:text-[16px] text-white/65">
              Payment received. It may take a moment to activate — if your dashboard is still locked, refresh the page.
            </p>
          ) : (
            <p className="text-[14px] md:text-[16px] text-white/65">
              Your subscription is active. Welcome to DEFRAG.
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-white/35 tracking-[0.2em] uppercase">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{verified ? `Dashboard in ${countdown}s` : 'Verifying payment…'}</span>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center h-12 px-9 bg-white text-black rounded-sm font-mono text-[13px] font-semibold uppercase tracking-[0.08em] hover:bg-white/90 active:scale-[0.98] transition-all duration-200"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function UnlockSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SuccessContent />
    </Suspense>
  );
}
