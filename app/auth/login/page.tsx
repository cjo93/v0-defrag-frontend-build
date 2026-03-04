"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="w-full max-w-md space-y-8 bg-[#0a0a0a] p-8 border border-[#333]">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-widest">DEFRAG</h1>
          <p className="text-sm text-gray-500 mt-2">ACCESS YOUR ACCOUNT</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleOAuth('google')}
            className="w-full bg-white text-black py-3 font-bold tracking-widest hover:bg-gray-200 transition-colors"
          >
            CONTINUE WITH GOOGLE
          </button>

          <button
            onClick={() => handleOAuth('apple')}
            className="w-full bg-[#111] border border-[#333] text-white py-3 font-bold tracking-widest hover:bg-[#222] transition-colors"
          >
            CONTINUE WITH APPLE
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#333]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0a] px-2 text-gray-500">Or email</span>
            </div>
          </div>

          <form onSubmit={handleMagicLink} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-black border border-[#333] px-4 py-3 text-sm focus:border-white transition-colors focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-[#111] border border-[#333] text-white py-3 text-sm font-bold tracking-widest hover:bg-[#222] transition-colors"
              disabled={loading}
            >
              {loading ? "SENDING..." : "SEND MAGIC LINK"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
