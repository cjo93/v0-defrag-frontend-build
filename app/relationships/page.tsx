"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getSession } from "@/lib/supabase";

export default function RelationshipsPage() {
  const { toast } = useToast();

  const [manual, setManual] = useState({ name: "", dob: "", time: "", location: "" });
  const [invitePhone, setInvitePhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const session = await getSession();
      if (!session) throw new Error("Unauthorized");

      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.defrag.app';
      const res = await fetch(`${API_URL}/api/relationships`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify(manual)
      });

      if (!res.ok) throw new Error("Failed to add relationship");

      toast({
        title: "Added",
        description: "Relationship has been successfully created.",
      });
      setManual({ name: "", dob: "", time: "", location: "" });
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

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const session = await getSession();
      if (!session) throw new Error("Unauthorized");

      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.defrag.app';
      const res = await fetch(`${API_URL}/api/relationships/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ phone: invitePhone })
      });

      if (!res.ok) throw new Error("Failed to send invite");

      toast({
        title: "Invite Sent",
        description: "A magic link has been sent to their phone.",
      });
      setInvitePhone("");
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
    <div className="min-h-screen bg-transparent text-white font-sans antialiased p-6 flex flex-col items-center">
      <div className="w-full max-w-[920px] space-y-10 py-12">
        <div>
          <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-3">People</p>
          <h1 className="text-[26px] md:text-[36px] font-normal tracking-[-0.015em]">Relationships</h1>
        </div>

        {/* ADD MANUALLY */}
        <section className="border border-white/10 bg-white/[0.02] rounded-sm p-7 md:p-8 space-y-5">
          <div>
            <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-1">Add Manually</h2>
          </div>
          <form onSubmit={handleManualAdd} className="grid grid-cols-1 gap-4">
            <input type="text" placeholder="Name" className="w-full bg-transparent border border-white/10 px-5 py-3.5 text-[14px] text-white placeholder:text-white/30 focus:border-white/25 transition-colors duration-200 focus:outline-none rounded-sm" value={manual.name} onChange={(e) => setManual({ ...manual, name: e.target.value })} required />
            <input type="date" className="w-full bg-transparent border border-white/10 px-5 py-3.5 text-[14px] text-white focus:border-white/25 transition-colors duration-200 focus:outline-none rounded-sm" value={manual.dob} onChange={(e) => setManual({ ...manual, dob: e.target.value })} required />
            <input type="time" className="w-full bg-transparent border border-white/10 px-5 py-3.5 text-[14px] text-white focus:border-white/25 transition-colors duration-200 focus:outline-none rounded-sm" value={manual.time} onChange={(e) => setManual({ ...manual, time: e.target.value })} required />
            <input type="text" placeholder="Location" className="w-full bg-transparent border border-white/10 px-5 py-3.5 text-[14px] text-white placeholder:text-white/30 focus:border-white/25 transition-colors duration-200 focus:outline-none rounded-sm" value={manual.location} onChange={(e) => setManual({ ...manual, location: e.target.value })} required />
            <button type="submit" className="w-full h-[48px] bg-white text-black rounded-sm font-mono text-[13px] font-semibold uppercase tracking-[0.08em] hover:bg-white/90 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed" disabled={loading}>
              {loading ? "Adding..." : "Add Relationship"}
            </button>
          </form>
        </section>

        {/* SEND INVITE */}
        <section className="border border-white/10 bg-white/[0.02] rounded-sm p-7 md:p-8 space-y-5">
          <div>
            <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-1">Send Invite</h2>
            <p className="text-[14px] text-white/45">Recipient enters their own birth data and manages their privacy settings.</p>
          </div>
          <form onSubmit={handleInvite} className="grid grid-cols-1 gap-4">
            <input type="tel" placeholder="Phone Number" className="w-full bg-transparent border border-white/10 px-5 py-3.5 text-[14px] text-white placeholder:text-white/30 focus:border-white/25 transition-colors duration-200 focus:outline-none rounded-sm" value={invitePhone} onChange={(e) => setInvitePhone(e.target.value)} required />
            <button type="submit" className="w-full h-[48px] border border-white/25 text-white/80 rounded-sm font-mono text-[13px] font-semibold uppercase tracking-[0.08em] hover:text-white hover:border-white/50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed" disabled={loading}>
              {loading ? "Sending..." : "Send Invite"}
            </button>
          </form>
        </section>

      </div>
    </div>
  );
}
