"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!sessionId) {
      router.replace("/unlock");
      return;
    }

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
  }, [sessionId, router]);

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
          <p className="text-[14px] md:text-[16px] text-white/65">
            Your subscription is active. Welcome to DEFRAG.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-white/35 tracking-[0.2em] uppercase">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Dashboard in {countdown}s</span>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center h-[48px] px-9 bg-white text-black rounded-sm font-mono text-[13px] font-semibold uppercase tracking-[0.08em] hover:bg-white/90 transition-colors duration-200"
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
