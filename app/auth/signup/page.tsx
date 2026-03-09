"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Turnstile } from "@/components/turnstile";
import { ServiceUnavailable } from "@/components/service-unavailable";
import { Loader2 } from "lucide-react";
import { getSiteUrl } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"password" | "magic_link">("password");

  const siteUrl = getSiteUrl();
  const isTurnstileRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const [nextPath, setNextPath] = useState("/onboarding");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = new URLSearchParams(window.location.search).get("next");
    if (next && next.startsWith("/")) setNextPath(next);
  }, []);

  const callbackUrl = `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`;

  if (!supabase) return <ServiceUnavailable />;
  const sb = supabase;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isTurnstileRequired && !turnstileToken) {
      toast({ title: "Verification required", description: "Please complete the security check.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      if (authMode === "password") {
        const { data, error } = await sb.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: callbackUrl,
          },
        });
        if (error) throw error;
        if (data.user && !data.session) {
          toast({ title: "Check your email", description: "Confirm your account before signing in." });
          setEmail("");
          setPassword("");
        } else {
          toast({ title: "Account created", description: "Welcome to DEFRAG." });
          router.push(nextPath);
        }
      } else {
        const { error } = await sb.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: callbackUrl,
          },
        });
        if (error) throw error;
        toast({ title: "Email sent", description: "Check your inbox for the magic link." });
        setEmail("");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased flex items-center justify-center p-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      <div className="w-full max-w-[400px] space-y-8 relative">
        <div className="space-y-2">
          <p className="font-mono text-[13px] font-semibold tracking-[0.2em]">DEFRAG</p>
          <h1 className="text-[28px] font-medium tracking-[-0.02em]">Create your account</h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full bg-transparent border border-white/[0.08] h-12 px-5 text-[14px] text-white placeholder:text-white/25 focus:border-white/25 transition-colors duration-200 focus:outline-none rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {authMode === "password" && (
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border border-white/[0.08] h-12 px-5 text-[14px] text-white placeholder:text-white/25 focus:border-white/25 transition-colors duration-200 focus:outline-none rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          )}

          {isTurnstileRequired && (
            <Turnstile
              onVerify={setTurnstileToken}
              onExpire={() => setTurnstileToken(null)}
              className="flex justify-center"
            />
          )}
          {turnstileToken && (
            <div className="flex items-center gap-2 text-white/40">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em]">Security check complete</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-white text-black font-mono text-[13px] uppercase tracking-[0.08em] hover:bg-white/90 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating account..." : (authMode === "password" ? "Create account" : "Send magic link")}
          </button>
        </form>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setAuthMode(authMode === "password" ? "magic_link" : "password")}
            className="text-[12px] uppercase tracking-[0.12em] text-white/35 hover:text-white/60 transition-colors duration-200 py-2"
          >
            {authMode === "password" ? "Use magic link" : "Use password"}
          </button>
          <Link href="/auth/login" className="text-[12px] uppercase tracking-[0.12em] text-white/35 hover:text-white/60 transition-colors duration-200">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
