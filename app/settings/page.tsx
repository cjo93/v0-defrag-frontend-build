"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { supabase, getSession, signOut } from "@/lib/supabase";
import { TopNav } from "@/components/top-nav";
import Panel from "@/components/panel";
import { Download, Loader2 } from "lucide-react";
import { planLabel, isTeam } from "@/lib/plan-label";

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setAccountEmail(data.user?.email ?? null);
    });
    // Load plan
    getSession().then(async (session) => {
      if (!session || !supabase) return;
      const { data } = await supabase
        .from('profiles')
        .select('plan')
        .eq('user_id', session.user.id)
        .single();
      if (data) setPlan(data.plan);
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

  const handleExport = async () => {
    setExporting(true);
    try {
      const session = await getSession();
      if (!session || !supabase) throw new Error("Unauthorized");

      // Gather user data
      const [{ data: birthline }, { data: people }, { data: conversations }] = await Promise.all([
        supabase.from('birthlines').select('*').eq('user_id', session.user.id).single(),
        supabase.from('people').select('*').eq('owner_user_id', session.user.id),
        supabase.from('conversations').select('id, person_id, created_at').eq('user_id', session.user.id),
      ]);

      const exportData = {
        exported_at: new Date().toISOString(),
        account: { email: accountEmail, plan },
        birthline,
        people: people || [],
        conversations: conversations || [],
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `defrag-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({ title: "Exported", description: "Your data has been downloaded." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Export failed", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans antialiased">
      <TopNav />
      <main className="px-6 pt-10 pb-16 flex flex-col items-center">
<div className="w-full max-w-[1100px] space-y-12">

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 mb-4">Account</p>
            <h1 className="text-[26px] md:text-[34px] font-normal tracking-[-0.015em] text-white">Settings</h1>
          </div>

          {/* Account */}
          <Panel title="ACCOUNT">
            <div className="space-y-6">
              {accountEmail && (
                <div className="flex items-center justify-between">
                  <p className="text-[14px] text-white/65">{accountEmail}</p>
                  {plan && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 border border-white/10 px-2.5 py-1 rounded-sm">
                      {planLabel(plan)}
                    </span>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/auth/reset"
                  className="inline-flex items-center justify-center h-12 px-6 border border-white/10 text-white/60 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:text-white hover:border-white/20 transition-colors duration-200"
                >
                  Reset Password
                </Link>
                <button
                  onClick={async () => {
                    await signOut();
                    router.push('/auth/login');
                  }}
                  className="inline-flex items-center justify-center h-12 px-6 border border-white/10 text-white/60 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:text-white hover:border-white/20 transition-all duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </Panel>

          {/* Update Birth Data */}
          <Panel title="BIRTH DATA">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Date of birth</label>
                  <input type="date" className="w-full bg-transparent border border-white/10 h-12 px-4 text-[14px] text-white focus:border-white/30 transition-colors duration-200 focus:outline-none rounded-sm [color-scheme:dark]" value={dob} onChange={(e) => setDob(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Birth time</label>
                  <input type="time" className="w-full bg-transparent border border-white/10 h-12 px-4 text-[14px] text-white focus:border-white/30 transition-colors duration-200 focus:outline-none rounded-sm [color-scheme:dark]" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Location</label>
                  <input type="text" placeholder="City, Country" className="w-full bg-transparent border border-white/10 h-12 px-4 text-[14px] text-white placeholder:text-white/30 focus:border-white/30 transition-colors duration-200 focus:outline-none rounded-sm" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
              </div>
              <button type="submit" className="inline-flex items-center justify-center h-12 px-6 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:bg-white/90 active:scale-[0.98] transition-colors duration-200 disabled:opacity-40" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : "Update & Recalculate"}
              </button>
            </form>
          </Panel>

          {/* Billing */}
          <Panel title="BILLING">
            <div className="space-y-6">
              <p className="text-[14px] text-white/55 leading-[1.6]">
                {isTeam(plan)
                  ? 'You are on the Team plan ($33/mo).'
                  : 'You are on the Solo plan ($19/mo).'}
              </p>
              <div className="flex gap-3">
                <Link
                  href="/unlock"
                  className="inline-flex items-center justify-center h-12 px-6 border border-white/10 text-white/60 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:text-white hover:border-white/20 transition-colors duration-200"
                >
                  {isTeam(plan) ? 'Manage Plan' : 'Upgrade to Team'}
                </Link>
              </div>
            </div>
          </Panel>

          {/* Preferences */}
          <Panel title="PREFERENCES">
            <div className="space-y-5">
              <label className="flex items-center space-x-3 text-[14px] text-white/65 cursor-pointer min-h-12">
                <input type="checkbox" className="w-4 h-4 border-white/20 bg-transparent checked:bg-white accent-white rounded-sm cursor-pointer" defaultChecked />
                <span>Email Notifications</span>
              </label>
              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[11px] text-white/50 tracking-[0.2em] uppercase">Audio Voice</label>
                <select className="bg-transparent border border-white/10 h-12 px-4 text-[14px] text-white focus:border-white/30 hover:border-white/20 transition-colors duration-200 focus:outline-none rounded-sm cursor-pointer">
                  <option>Voice 1 (Default)</option>
                  <option>Voice 2</option>
                </select>
              </div>
              <label className="flex items-center space-x-3 text-[14px] text-white/65 cursor-pointer min-h-12">
                <input type="checkbox" className="w-4 h-4 border-white/20 bg-transparent checked:bg-white accent-white rounded-sm cursor-pointer" />
                <span>Share full chart with invites (Default: Derived analysis only)</span>
              </label>
            </div>
          </Panel>

          {/* Data */}
          <Panel title="YOUR DATA">
            <div className="space-y-6">
              <p className="text-[14px] text-white/55 leading-[1.6]">
                Download all your data in a portable JSON format.
              </p>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 border border-white/10 text-white/60 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:text-white hover:border-white/20 transition-colors duration-200 disabled:opacity-40"
              >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {exporting ? "Exporting..." : "Export Data"}
              </button>
            </div>
          </Panel>

          {/* Danger Zone */}
          <div className="border border-red-500/15 bg-red-500/[0.03] rounded-sm p-6 space-y-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-red-500/50 font-medium pb-3 mb-4 border-b border-red-500/10">
              DANGER ZONE
            </div>
            <p className="text-[14px] text-white/45 leading-[1.6]">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button className="inline-flex items-center justify-center h-12 px-6 border border-red-500/20 text-red-500/70 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-colors duration-200">
              Delete Account
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
