"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getSession } from "@/lib/supabase";
import { TopNav } from "@/components/top-nav";

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-black text-white">
      <TopNav />
      <main className="px-6 pt-12 pb-24 flex flex-col items-center">
        <div className="w-full max-w-[920px] space-y-12">

          <h1 className="font-serif text-[28px] font-light tracking-[-0.02em] text-white">Settings</h1>

          {/* Update Birth Data */}
          <section className="space-y-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40 border-b border-white/10 pb-2">Update Birth Data</h2>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-4">
              <input type="date" className="bg-black border border-white/10 px-4 py-3 text-[14px] text-white focus:border-white/30 transition-colors duration-200 focus:outline-none rounded-lg" value={dob} onChange={(e) => setDob(e.target.value)} required />
              <input type="time" className="bg-black border border-white/10 px-4 py-3 text-[14px] text-white focus:border-white/30 transition-colors duration-200 focus:outline-none rounded-lg" value={time} onChange={(e) => setTime(e.target.value)} required />
              <input type="text" placeholder="Location" className="bg-black border border-white/10 px-4 py-3 text-[14px] text-white placeholder:text-white/25 focus:border-white/30 transition-colors duration-200 focus:outline-none rounded-lg" value={location} onChange={(e) => setLocation(e.target.value)} required />
              <button type="submit" className="bg-white text-black px-6 py-3 font-mono text-[13px] font-bold tracking-widest hover:bg-white/90 transition-colors duration-200 disabled:opacity-40 rounded-lg" disabled={loading}>
                {loading ? "UPDATING..." : "UPDATE & RECALCULATE"}
              </button>
            </form>
          </section>

          {/* Account Management */}
          <section className="space-y-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40 border-b border-white/10 pb-2">Account Management</h2>
            <form className="grid grid-cols-1 gap-4" onSubmit={(e) => e.preventDefault()}>
              <input type="password" placeholder="New Password" className="bg-black border border-white/10 px-4 py-3 text-[14px] text-white placeholder:text-white/25 focus:border-white/30 transition-colors duration-200 focus:outline-none rounded-lg" />
              <button type="submit" className="bg-white/[0.02] text-white border border-white/10 px-6 py-3 font-mono text-[13px] font-bold tracking-widest hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200 rounded-lg">RESET PASSWORD</button>
            </form>
          </section>

          {/* Preferences */}
          <section className="space-y-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40 border-b border-white/10 pb-2">Preferences</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 text-[14px] text-white/70 cursor-pointer">
                <input type="checkbox" className="border-white/20 bg-black checked:bg-white accent-white" defaultChecked />
                <span>Email Notifications</span>
              </label>
              <div className="flex flex-col space-y-2">
                <span className="font-mono text-[11px] text-white/30 tracking-wider">Audio Voice</span>
                <select className="bg-black border border-white/10 px-4 py-3 text-[14px] text-white focus:border-white/30 transition-colors duration-200 focus:outline-none rounded-lg">
                  <option>Voice 1 (Default)</option>
                  <option>Voice 2</option>
                </select>
              </div>
              <label className="flex items-center space-x-3 text-[14px] text-white/70 cursor-pointer">
                <input type="checkbox" className="border-white/20 bg-black checked:bg-white accent-white" />
                <span>Share full chart with invites (Default: Derived analysis only)</span>
              </label>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="space-y-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-red-500/60 border-b border-red-500/20 pb-2">Danger Zone</h2>
            <button className="bg-black text-red-500/80 border border-red-500/20 px-6 py-3 font-mono text-[13px] font-bold tracking-widest hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200 w-full rounded-lg">
              DELETE ACCOUNT
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}
