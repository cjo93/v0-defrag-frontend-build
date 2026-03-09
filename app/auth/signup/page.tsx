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

        // If email confirmation is required, user won't have a session yet
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
    <div className="min-h-screen bg-[#09090b] text-white font-sans antialiased flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,255,255,0.04), transparent 70%)' }}
      />

      <div className="relative w-full max-w-[440px] space-y-8 border border-white/[0.08] bg-white/[0.02] p-8 md:p-10 rounded-2xl animate-fade-in">
        <div className="text-center">
          <p className="text-[14px] font-bold tracking-[0.2em] text-white/90 uppercase mb-3">DEFRAG</p>
          <p className="text-[12px] uppercase tracking-[0.18em] text-white/40">Create your account</p>
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

          <div className="space-y-2">
            {isTurnstileRequired && (
              <Turnstile
                onVerify={setTurnstileToken}
                onExpire={() => setTurnstileToken(null)}
                className="flex justify-center"
              />
            )}
            {turnstileToken && (
              <p className="text-center text-[11px] text-white/35 tracking-[0.12em] uppercase animate-fade-in-soft">
                Security check complete
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 h-12 bg-white text-[#09090b] text-[13px] font-bold uppercase tracking-[0.08em] hover:bg-white/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl"
            disabled={loading || (isTurnstileRequired && !turnstileToken)}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating account..." : (authMode === "password" ? "Create account" : "Send magic link")}
          </button>
        </form>

        <div className="flex flex-col items-center gap-2 pt-2">
           <button
             type="button"
             onClick={() => setAuthMode(authMode === "password" ? "magic_link" : "password")}
             className="text-[12px] uppercase tracking-[0.12em] text-white/35 hover:text-white/60 transition-colors duration-200 py-2"
           >
             {authMode === "password" ? "Use magic link" : "Use password"}
           </button>

          <Link
            href="/auth/login"
            className="text-[12px] uppercase tracking-[0.12em] text-white/35 hover:text-white/60 transition-colors duration-200 py-2"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
