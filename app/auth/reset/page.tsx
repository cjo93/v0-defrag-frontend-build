"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Turnstile } from "@/components/turnstile";
import { ServiceUnavailable } from "@/components/service-unavailable";

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  if (!supabase) return <ServiceUnavailable />;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://defrag.app';
  const isTurnstileRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isTurnstileRequired && !turnstileToken) {
      toast({ title: "Verification required", description: "Please complete the security check.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/reset/confirm`,
      });
      if (error) throw error;

      setSent(true);
      toast({ title: "Email sent", description: "Check your inbox for the password reset link." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] space-y-8 border border-white/[0.08] bg-white/[0.03] p-8 md:p-10 rounded-xl animate-fade-in">
        <div className="text-center">
          <p className="font-mono text-[13px] font-semibold tracking-[0.2em] text-white mb-3">DEFRAG</p>
          <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Reset your password</p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <p className="text-[15px] text-white/65">Password reset email sent. Check your inbox.</p>
            <Link
              href="/auth/login"
              className="inline-block font-mono text-[11px] uppercase tracking-[0.15em] text-white/45 hover:text-white/70 transition-colors duration-200"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleReset} className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-black border border-white/[0.08] px-5 py-3.5 text-[15px] text-white placeholder:text-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-200 focus:outline-none rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="space-y-2">
                {isTurnstileRequired && (
                  <Turnstile
                    onVerify={setTurnstileToken}
                    onExpire={() => setTurnstileToken(null)}
                    className="flex justify-center"
                  />
                )}
                {turnstileToken && (
                  <p className="text-center font-mono text-[11px] text-white/40 tracking-[0.15em] uppercase animate-fade-in-soft">
                    Security check complete
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center h-[52px] bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] hover:bg-white/90 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] active:scale-[0.98] transition-all duration-200 ease-out disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none rounded-xl"
                disabled={loading || (isTurnstileRequired && !turnstileToken)}
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>

            <div className="text-center pt-2">
              <Link
                href="/auth/login"
                className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/45 hover:text-white/70 transition-colors duration-200"
              >
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
