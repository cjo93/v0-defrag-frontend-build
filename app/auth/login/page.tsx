"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Turnstile } from "@/components/turnstile";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const isTurnstileRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isTurnstileRequired && !turnstileToken) {
      toast({ title: "Verification required", description: "Please complete the security check.", variant: "destructive" });
      return;
    }
    
    setLoading(true);

    if (!supabase) {
      toast({ title: "Error", description: "Auth is disabled.", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      toast({
        title: "Magic Link Sent",
        description: "Check your email for the login link.",
      });
      setEmail("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    if (isTurnstileRequired && !turnstileToken) {
      toast({ title: "Verification required", description: "Please complete the security check.", variant: "destructive" });
      return;
    }
    
    if (!supabase) return;

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] space-y-8 border border-white/[0.08] bg-white/[0.03] p-8 md:p-10 rounded-xl">
        <div className="text-center">
          <p className="font-mono text-[13px] font-semibold tracking-[0.2em] text-white mb-3">DEFRAG</p>
          <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Access your account</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleOAuth('google')}
            className="w-full inline-flex items-center justify-center h-[52px] bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] hover:bg-white/90 transition-colors duration-200 rounded-xl"
          >
            Continue with Google
          </button>

          <button
            onClick={() => handleOAuth('apple')}
            className="w-full inline-flex items-center justify-center h-[52px] border border-white/25 text-white/80 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] hover:text-white hover:border-white/50 transition-all duration-200 rounded-xl"
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

          <form onSubmit={handleMagicLink} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-black border border-white/[0.08] px-5 py-3.5 text-[15px] text-white placeholder:text-white/30 focus:border-white/25 transition-colors duration-200 focus:outline-none rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Turnstile 
              onVerify={setTurnstileToken}
              onExpire={() => setTurnstileToken(null)}
              className="flex justify-center"
            />
            
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center h-[52px] border border-white/25 text-white/80 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] hover:text-white hover:border-white/50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl"
              disabled={loading || (isTurnstileRequired && !turnstileToken)}
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
