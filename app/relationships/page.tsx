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
    <div className="min-h-screen bg-black text-white font-mono p-8 flex flex-col items-center">
      <header className="w-full max-w-2xl border-b border-[#333] pb-4 mb-8">
        <h1 className="text-xl font-bold tracking-widest">RELATIONSHIPS</h1>
      </header>

      <div className="w-full max-w-2xl space-y-12">

        {/* ADD MANUALLY */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-gray-400 border-b border-[#333] pb-2">Add Manually</h2>
          <form onSubmit={handleManualAdd} className="grid grid-cols-1 gap-4">
            <input type="text" placeholder="Name" className="bg-black border border-[#333] px-4 py-2 text-sm focus:border-white transition-colors" value={manual.name} onChange={(e) => setManual({ ...manual, name: e.target.value })} required />
            <input type="date" className="bg-black border border-[#333] px-4 py-2 text-sm focus:border-white transition-colors" value={manual.dob} onChange={(e) => setManual({ ...manual, dob: e.target.value })} required />
            <input type="time" className="bg-black border border-[#333] px-4 py-2 text-sm focus:border-white transition-colors" value={manual.time} onChange={(e) => setManual({ ...manual, time: e.target.value })} required />
            <input type="text" placeholder="Location" className="bg-black border border-[#333] px-4 py-2 text-sm focus:border-white transition-colors" value={manual.location} onChange={(e) => setManual({ ...manual, location: e.target.value })} required />
            <button type="submit" className="bg-white text-black px-6 py-2 text-sm font-bold tracking-widest hover:bg-gray-200 transition-colors" disabled={loading}>
              {loading ? "ADDING..." : "ADD RELATIONSHIP"}
            </button>
          </form>
        </section>

        {/* SEND INVITE */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-gray-400 border-b border-[#333] pb-2">Send Invite</h2>
          <p className="text-xs text-gray-500">Recipient enters their own birth data and manages their privacy settings.</p>
          <form onSubmit={handleInvite} className="grid grid-cols-1 gap-4">
            <input type="tel" placeholder="Phone Number" className="bg-black border border-[#333] px-4 py-2 text-sm focus:border-white transition-colors" value={invitePhone} onChange={(e) => setInvitePhone(e.target.value)} required />
            <button type="submit" className="bg-[#111] border border-[#333] text-white px-6 py-2 text-sm font-bold hover:bg-[#222] transition-colors" disabled={loading}>
              {loading ? "SENDING..." : "SEND INVITE"}
            </button>
          </form>
        </section>

      </div>
    </div>
  );
}
