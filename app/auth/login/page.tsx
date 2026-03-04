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
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white/[0.02] p-8 border border-white/10">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-[0.2em]">DEFRAG</h1>
          <p className="font-mono text-[12px] text-white/40 mt-2 tracking-widest">ACCESS YOUR ACCOUNT</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleOAuth('google')}
            className="w-full bg-white text-black py-3 font-mono text-[13px] font-bold tracking-widest hover:bg-white/90 transition-colors duration-200"
          >
            CONTINUE WITH GOOGLE
          </button>

          <button
            onClick={() => handleOAuth('apple')}
            className="w-full bg-white/[0.02] border border-white/10 text-white py-3 font-mono text-[13px] font-bold tracking-widest hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200"
          >
            CONTINUE WITH APPLE
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-3 text-white/30 font-mono text-[11px] tracking-wider">Or email</span>
            </div>
          </div>

          <form onSubmit={handleMagicLink} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-black border border-white/10 px-4 py-3 text-[14px] text-white placeholder:text-white/25 focus:border-white/30 transition-colors duration-200 focus:outline-none"
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
              className="w-full bg-white/[0.02] border border-white/10 text-white py-3 font-mono text-[13px] font-bold tracking-widest hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={loading || (isTurnstileRequired && !turnstileToken)}
            >
              {loading ? "SENDING..." : "SEND MAGIC LINK"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
