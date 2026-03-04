"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { ServiceUnavailable } from "@/components/service-unavailable";

export default function ResetConfirmPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!supabase) return <ServiceUnavailable />;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast({ title: "Password updated", description: "You can now sign in with your new password." });
      router.push("/dashboard");
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
          <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Set new password</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            className="w-full bg-black border border-white/[0.08] px-5 py-3.5 text-[15px] text-white placeholder:text-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-200 focus:outline-none rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center h-[52px] bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] hover:bg-white/90 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] active:scale-[0.98] transition-all duration-200 ease-out disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none rounded-xl"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
