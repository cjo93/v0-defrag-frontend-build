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
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <CheckCircle className="w-16 h-16 text-white mx-auto" />

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">You're In</h1>
          <p className="text-gray-400">
            Your subscription is active. Welcome to DEFRAG.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Redirecting to dashboard in {countdown}s...</span>
        </div>

        <Link
          href="/dashboard"
          className="inline-block text-sm font-bold tracking-wider text-white hover:underline"
        >
          GO TO DASHBOARD NOW →
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
