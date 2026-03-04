"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getSession } from "@/lib/supabase";

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
    <div className="min-h-screen bg-black text-white font-mono p-8 flex flex-col items-center">
      <header className="w-full max-w-2xl border-b border-white/10 pb-6 mb-8 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-[0.2em]">SETTINGS</h1>
        <button onClick={() => router.back()} className="text-[12px] text-white/40 hover:text-white/80 transition-colors duration-200 tracking-widest">
          BACK
        </button>
      </header>

      <div className="w-full max-w-2xl space-y-12">

        {/* Update Birth Data */}
        <section className="space-y-4">
          <h2 className="font-mono text-[12px] uppercase tracking-widest text-white/40 border-b border-white/10 pb-2">Update Birth Data</h2>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-4">
            <input type="date" className="bg-black border border-white/10 px-4 py-3 text-[14px] text-white focus:border-white/30 transition-colors duration-200 focus:outline-none" value={dob} onChange={(e) => setDob(e.target.value)} required />
            <input type="time" className="bg-black border border-white/10 px-4 py-3 text-[14px] text-white focus:border-white/30 transition-colors duration-200 focus:outline-none" value={time} onChange={(e) => setTime(e.target.value)} required />
            <input type="text" placeholder="Location" className="bg-black border border-white/10 px-4 py-3 text-[14px] text-white placeholder:text-white/25 focus:border-white/30 transition-colors duration-200 focus:outline-none" value={location} onChange={(e) => setLocation(e.target.value)} required />
            <button type="submit" className="bg-white text-black px-6 py-3 font-mono text-[13px] font-bold tracking-widest hover:bg-white/90 transition-colors duration-200 disabled:opacity-40" disabled={loading}>
              {loading ? "UPDATING..." : "UPDATE & RECALCULATE"}
            </button>
          </form>
        </section>

        {/* Account Management */}
        <section className="space-y-4">
          <h2 className="font-mono text-[12px] uppercase tracking-widest text-white/40 border-b border-white/10 pb-2">Account Management</h2>
          <form className="grid grid-cols-1 gap-4" onSubmit={(e) => e.preventDefault()}>
            <input type="password" placeholder="New Password" className="bg-black border border-white/10 px-4 py-3 text-[14px] text-white placeholder:text-white/25 focus:border-white/30 transition-colors duration-200 focus:outline-none" />
            <button type="submit" className="bg-white/[0.02] text-white border border-white/10 px-6 py-3 font-mono text-[13px] font-bold tracking-widest hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200">RESET PASSWORD</button>
          </form>
        </section>

        {/* Preferences */}
        <section className="space-y-4">
          <h2 className="font-mono text-[12px] uppercase tracking-widest text-white/40 border-b border-white/10 pb-2">Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3 text-[14px] text-white/70 cursor-pointer">
              <input type="checkbox" className="border-white/20 bg-black checked:bg-white accent-white" defaultChecked />
              <span>Email Notifications</span>
            </label>
            <div className="flex flex-col space-y-2">
              <span className="font-mono text-[11px] text-white/30 tracking-wider">Audio Voice</span>
              <select className="bg-black border border-white/10 px-4 py-3 text-[14px] text-white focus:border-white/30 transition-colors duration-200 focus:outline-none">
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
          <h2 className="font-mono text-[12px] uppercase tracking-widest text-red-500/60 border-b border-red-500/20 pb-2">Danger Zone</h2>
          <button className="bg-black text-red-500/80 border border-red-500/20 px-6 py-3 font-mono text-[13px] font-bold tracking-widest hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200 w-full">
            DELETE ACCOUNT
          </button>
        </section>

      </div>
    </div>
  );
}
