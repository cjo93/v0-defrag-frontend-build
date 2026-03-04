"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { supabase, getSession, signOut } from "@/lib/supabase";
import { TopNav } from "@/components/top-nav";

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setAccountEmail(data.user?.email ?? null);
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const session = await getSession();
      if (!session) throw new Error("Unauthorized");

      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.defrag.app';
      const res = await fetch(`${API_URL}/api/profile/generate-chart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ dob, birth_time: time, birth_location: location })
      });

      if (!res.ok) throw new Error("Failed to update chart");

      toast({
        title: "Success",
        description: "Your birth data has been updated and chart recalculated.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans antialiased">
      <TopNav />
      <main className="px-6 pt-12 pb-24 flex flex-col items-center">
        <div className="w-full max-w-[920px] space-y-10">

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 mb-4">Account</p>
            <h1 className="text-[26px] md:text-[34px] font-normal tracking-[-0.015em] text-white">Settings</h1>
          </div>

          {/* Update Birth Data */}
          <section className="border border-white/[0.08] bg-white/[0.03] rounded-sm p-7 md:p-8 space-y-5">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Update Birth Data</h2>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-4">
              <input type="date" className="bg-transparent border border-white/[0.08] px-5 py-3.5 text-[14px] text-white focus:border-white/25 transition-colors duration-200 focus:outline-none rounded-sm" value={dob} onChange={(e) => setDob(e.target.value)} required />
              <input type="time" className="bg-transparent border border-white/[0.08] px-5 py-3.5 text-[14px] text-white focus:border-white/25 transition-colors duration-200 focus:outline-none rounded-sm" value={time} onChange={(e) => setTime(e.target.value)} required />
              <input type="text" placeholder="Location" className="bg-transparent border border-white/[0.08] px-5 py-3.5 text-[14px] text-white placeholder:text-white/30 focus:border-white/25 transition-colors duration-200 focus:outline-none rounded-sm" value={location} onChange={(e) => setLocation(e.target.value)} required />
              <button type="submit" className="inline-flex items-center justify-center h-[48px] px-9 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:bg-white/90 transition-colors duration-200 disabled:opacity-40" disabled={loading}>
                {loading ? "UPDATING..." : "UPDATE & RECALCULATE"}
              </button>
            </form>
          </section>

          {/* Account */}
          <section className="border border-white/[0.08] bg-white/[0.03] rounded-sm p-7 md:p-8 space-y-5">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Account</h2>
            {accountEmail && (
              <p className="text-[14px] text-white/65">{accountEmail}</p>
            )}
            <div className="grid grid-cols-1 gap-4">
              <Link
                href="/auth/reset"
                className="inline-flex items-center justify-center h-[48px] px-9 border border-white/25 text-white/80 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:text-white hover:border-white/50 transition-all duration-200"
              >
                Reset Password
              </Link>
              <button
                onClick={async () => {
                  await signOut();
                  router.push('/auth/login');
                }}
                className="inline-flex items-center justify-center h-[48px] px-9 border border-white/25 text-white/80 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:text-white hover:border-white/50 transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </section>

          {/* Preferences */}
          <section className="border border-white/[0.08] bg-white/[0.03] rounded-sm p-7 md:p-8 space-y-5">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Preferences</h2>
            <div className="space-y-5">
              <label className="flex items-center space-x-3 text-[14px] text-white/65 cursor-pointer">
                <input type="checkbox" className="border-white/20 bg-transparent checked:bg-white accent-white" defaultChecked />
                <span>Email Notifications</span>
              </label>
              <div className="flex flex-col space-y-2">
                <span className="font-mono text-[11px] text-white/45 tracking-[0.2em] uppercase">Audio Voice</span>
                <select className="bg-transparent border border-white/[0.08] px-5 py-3.5 text-[14px] text-white focus:border-white/25 transition-colors duration-200 focus:outline-none rounded-sm">
                  <option>Voice 1 (Default)</option>
                  <option>Voice 2</option>
                </select>
              </div>
              <label className="flex items-center space-x-3 text-[14px] text-white/65 cursor-pointer">
                <input type="checkbox" className="border-white/20 bg-transparent checked:bg-white accent-white" />
                <span>Share full chart with invites (Default: Derived analysis only)</span>
              </label>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="border border-red-500/15 bg-red-500/[0.03] rounded-sm p-7 md:p-8 space-y-5">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-red-500/60">Danger Zone</h2>
            <button className="inline-flex items-center justify-center h-[48px] px-9 w-full border border-red-500/20 text-red-500/80 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200">
              Delete Account
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}
