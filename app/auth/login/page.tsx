"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Turnstile } from "@/components/turnstile";
import { ServiceUnavailable } from "@/components/service-unavailable";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  if (!supabase) return <ServiceUnavailable />;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://defrag.app';
  const isTurnstileRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const appleEnabled = process.env.NEXT_PUBLIC_ENABLE_APPLE_OAUTH === 'true';

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isTurnstileRequired && !turnstileToken) {
      toast({ title: "Verification required", description: "Please complete the security check.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({ title: "Invalid credentials", description: "Check your email and password.", variant: "destructive" });
          return;
        }
        throw error;
      }
      router.push("/dashboard");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAppleOAuth = async () => {
    if (isTurnstileRequired && !turnstileToken) {
      toast({ title: "Verification required", description: "Please complete the security check.", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: { redirectTo: `${siteUrl}/dashboard` }
      });
      if (error) {
        if (error.message?.includes('provider is not enabled') || (error as any).error_code === 'validation_failed') {
          toast({ title: "Not available yet", description: "Apple sign-in isn't available yet. Use email + password.", variant: "destructive" });
          return;
        }
        throw error;
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] space-y-8 border border-white/[0.08] bg-white/[0.03] p-8 md:p-10 rounded-xl animate-fade-in">
        <div className="text-center">
          <p className="font-mono text-[13px] font-semibold tracking-[0.2em] text-white mb-3">DEFRAG</p>
          <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Access your account</p>
        </div>

        <div className="space-y-4">
          {appleEnabled && (
            <>
              <button
                onClick={handleAppleOAuth}
                className="w-full inline-flex items-center justify-center h-[52px] bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] hover:bg-white/90 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] active:scale-[0.98] transition-all duration-200 ease-out rounded-xl"
              >
                Continue with Apple
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/[0.08]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-black px-3 text-white/45 font-mono text-[11px] tracking-[0.2em] uppercase">Or email</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-black border border-white/[0.08] px-5 py-3.5 text-[15px] text-white placeholder:text-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-200 focus:outline-none rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-black border border-white/[0.08] px-5 py-3.5 text-[15px] text-white placeholder:text-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-200 focus:outline-none rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/auth/signup"
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/45 hover:text-white/70 transition-colors duration-200"
            >
              Create account
            </Link>
            <Link
              href="/auth/reset"
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/45 hover:text-white/70 transition-colors duration-200"
            >
              Reset password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
