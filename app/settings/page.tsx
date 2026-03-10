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

      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
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
      <header className="w-full max-w-2xl border-b border-[#333] pb-4 mb-8">
        <h1 className="text-xl font-bold tracking-widest">SETTINGS</h1>
      </header>

      <div className="w-full max-w-2xl space-y-12">

        {/* Update Birth Data */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-gray-400 border-b border-[#333] pb-2">Update Birth Data</h2>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-4">
            <input type="date" className="bg-black border border-[#333] px-4 py-2 text-sm focus:border-white transition-colors" value={dob} onChange={(e) => setDob(e.target.value)} required />
            <input type="time" className="bg-black border border-[#333] px-4 py-2 text-sm focus:border-white transition-colors" value={time} onChange={(e) => setTime(e.target.value)} required />
            <input type="text" placeholder="Location" className="bg-black border border-[#333] px-4 py-2 text-sm focus:border-white transition-colors" value={location} onChange={(e) => setLocation(e.target.value)} required />
            <button type="submit" className="bg-white text-black px-6 py-2 text-sm font-bold tracking-widest hover:bg-gray-200 transition-colors" disabled={loading}>
              {loading ? "UPDATING..." : "UPDATE & RECALCULATE"}
            </button>
          </form>
        </section>

        {/* Account Management */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-gray-400 border-b border-[#333] pb-2">Account Management</h2>
          <form className="grid grid-cols-1 gap-4" onSubmit={(e) => e.preventDefault()}>
            <input type="password" placeholder="New Password" className="bg-black border border-[#333] px-4 py-2 text-sm focus:border-white transition-colors" />
            <button type="submit" className="bg-[#111] text-white border border-[#333] px-6 py-2 text-sm font-bold hover:bg-[#222] transition-colors">RESET PASSWORD</button>
          </form>
        </section>

        {/* Preferences */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-gray-400 border-b border-[#333] pb-2">Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3 text-sm">
              <input type="checkbox" className="border-[#333] bg-black checked:bg-white" defaultChecked />
              <span>Email Notifications</span>
            </label>
            <div className="flex flex-col space-y-2">
              <span className="text-xs text-gray-500">Audio Voice</span>
              <select className="bg-black border border-[#333] px-4 py-2 text-sm focus:border-white transition-colors">
                <option>Voice 1 (Default)</option>
                <option>Voice 2</option>
              </select>
            </div>
            <label className="flex items-center space-x-3 text-sm">
              <input type="checkbox" className="border-[#333] bg-black checked:bg-white" />
              <span>Share full chart with invites (Default: Derived analysis only)</span>
            </label>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-red-900 border-b border-red-900 pb-2">Danger Zone</h2>
          <button className="bg-black text-red-500 border border-red-900 px-6 py-2 text-sm font-bold tracking-widest hover:bg-red-900/20 transition-colors w-full">
            DELETE ACCOUNT
          </button>
        </section>

      </div>
    </div>
  );
}
