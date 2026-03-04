"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Turnstile } from "@/components/turnstile";
import { ServiceUnavailable } from "@/components/service-unavailable";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  if (!supabase) return <ServiceUnavailable />;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://defrag.app';
  const isTurnstileRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isTurnstileRequired && !turnstileToken) {
      toast({ title: "Verification required", description: "Please complete the security check.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (error) throw error;

      // If email confirmation is required, user won't have a session yet
      if (data.user && !data.session) {
        toast({ title: "Check your email", description: "Confirm your account before signing in." });
        setEmail("");
        setPassword("");
      } else {
        toast({ title: "Account created", description: "Welcome to DEFRAG." });
        router.push("/onboarding");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans antialiased flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] space-y-8 border border-white/[0.08] bg-white/[0.03] p-8 md:p-10 rounded-sm animate-fade-in">
        <div className="text-center">
          <p className="font-mono text-[13px] font-semibold tracking-[0.2em] text-white mb-3">DEFRAG</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Create your account</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full bg-transparent border border-white/[0.08] px-5 py-3.5 text-[14px] text-white placeholder:text-white/30 focus:border-white/30 transition-all duration-200 focus:outline-none rounded-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent border border-white/[0.08] px-5 py-3.5 text-[14px] text-white placeholder:text-white/30 focus:border-white/30 transition-all duration-200 focus:outline-none rounded-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
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
            className="w-full inline-flex items-center justify-center h-[48px] bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] hover:bg-white/90 active:scale-[0.98] transition-all duration-200 ease-out disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
            disabled={loading || (isTurnstileRequired && !turnstileToken)}
          >
            {loading ? "Creating account..." : "Create account"}
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
      </div>
    </div>
  );
}
