"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, getSession } from "@/lib/supabase";
import { Lock, MessageCircle, Users, Calendar, Headphones } from "lucide-react";
import Link from "next/link";
import { TopNav } from "@/components/top-nav";

type UserStatus = {
  plan: 'solo' | 'plus';
  has_relationships: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<UserStatus | null>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const session = await getSession();
        if (!session || !supabase) {
          router.push('/auth/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('user_id', session.user.id)
          .single();

        const { count } = await supabase
          .from('connections')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', session.user.id);

        setStatus({
          plan: profile?.plan || 'solo',
          has_relationships: (count || 0) > 0,
        });
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, [router]);

  const isPlus = status?.plan === 'plus';

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans antialiased">
        <TopNav />
        <main className="px-6 md:px-8 pt-12 pb-24 flex flex-col items-center">
          <div className="w-full max-w-[920px]">
            <div className="animate-pulse space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="border border-white/10 bg-white/[0.02] rounded-xl p-6 md:p-8 space-y-4">
                  <div className="h-3 w-24 bg-white/[0.06] rounded" />
                  <div className="h-5 w-2/3 bg-white/[0.04] rounded" />
                  <div className="h-4 w-full bg-white/[0.04] rounded" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      <TopNav />
      <main className="px-6 md:px-8 pt-12 pb-24 flex flex-col items-center">
        <div className="w-full max-w-[920px] space-y-6">

          {/* ─── TODAY ─── */}
          <section className="border border-white/10 bg-white/[0.02] rounded-xl p-6 md:p-8 space-y-6 hover:border-white/20 hover:bg-white/[0.04] hover:translate-y-[-1px] transition-all duration-200 ease-out animate-fade-in">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/50" />
              <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Today</h2>
            </div>

            <p className="text-[17px] md:text-[20px] leading-[1.6] text-white/70">
              Today favors slower conversations. Pressure may rise if discussions become defensive.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Pressure', value: 'Calm', color: 'text-green-400/80' },
                { label: 'Timing', value: 'Favorable', color: 'text-white' },
                { label: 'Best For', value: 'Listening', color: 'text-white' },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <span className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/45">{item.label}</span>
                  <p className={`text-[15px] md:text-[16px] font-medium ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── PEOPLE ─── */}
          {isPlus ? (
            <section className="border border-white/10 bg-white/[0.02] rounded-xl p-6 md:p-8 space-y-5 hover:border-white/20 hover:bg-white/[0.04] hover:translate-y-[-1px] transition-all duration-200 ease-out animate-fade-in delay-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white/50" />
                  <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">People</h2>
                </div>
                <Link href="/relationships" className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 hover:text-white/80 transition-colors duration-200">
                  View All →
                </Link>
              </div>

              {status?.has_relationships ? (
                <div className="grid gap-3">
                  {[
                    { name: 'Mom', relationship: 'Mother', tension: 'Rising', tensionColor: 'text-yellow-400/80' },
                    { name: 'Dad', relationship: 'Father', tension: 'Stable', tensionColor: 'text-green-400/80' },
                    { name: 'Sister', relationship: 'Sibling', tension: 'Low', tensionColor: 'text-white/50' },
                  ].map((person) => (
                    <Link
                      key={person.name}
                      href={`/chat?prompt=Tell me about my dynamic with ${person.name}`}
                      className="flex items-center justify-between border border-white/[0.06] bg-white/[0.02] rounded-lg px-5 py-4 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200 ease-out"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-[15px] text-white font-medium">{person.name}</span>
                        <span className="font-mono text-[11px] text-white/40 uppercase tracking-[0.15em]">{person.relationship}</span>
                      </div>
                      <span className={`font-mono text-[11px] uppercase tracking-[0.15em] ${person.tensionColor}`}>{person.tension}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[15px] md:text-[16px] text-white/65 leading-[1.6]">
                    Add family and team members to map group dynamics.
                  </p>
                  <Link
                    href="/relationships"
                    className="inline-flex items-center justify-center h-[44px] px-6 border border-white/25 text-white/80 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/50 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] active:scale-[0.98] transition-all duration-200 ease-out"
                  >
                    Add Person
                  </Link>
                </div>
              )}
            </section>
          ) : (
            <section className="border border-white/[0.06] bg-white/[0.01] rounded-xl p-6 md:p-8 space-y-4 animate-fade-in delay-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white/30" />
                  <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/30">People</h2>
                </div>
                <Lock className="w-4 h-4 text-white/30" />
              </div>
              <p className="text-[15px] md:text-[16px] text-white/40 leading-[1.6]">
                Add family and team members to understand group dynamics.
              </p>
              <Link
                href="/unlock"
                className="inline-flex items-center justify-center h-[44px] px-6 border border-white/15 text-white/60 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/35 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] active:scale-[0.98] transition-all duration-200 ease-out"
              >
                Upgrade to Plus
              </Link>
            </section>
          )}

          {/* ─── ASK DEFRAG ─── */}
          <Link href="/chat" className="block group">
            <section className="border border-white/10 bg-white/[0.02] rounded-xl p-6 md:p-8 space-y-5 group-hover:border-white/20 group-hover:bg-white/[0.04] group-hover:translate-y-[-1px] transition-all duration-200 ease-out animate-fade-in delay-100">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-white/50" />
                <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Ask DEFRAG</h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  "Why does my dad push so hard?",
                  "Why can't my sister see my perspective?",
                  "How do I say this without escalation?",
                ].map((prompt, i) => (
                  <div key={i} className="border border-white/[0.06] bg-white/[0.02] rounded-lg px-4 py-3 text-[14px] md:text-[15px] text-white/55 hover:border-white/20 hover:text-white/70 transition-all duration-200">
                    {prompt}
                  </div>
                ))}
              </div>

              <span className="inline-flex items-center justify-center h-[44px] px-6 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl group-hover:bg-white/90 transition-colors duration-200">
                Start Chat
              </span>
            </section>
          </Link>

          {/* ─── DAILY BRIEF ─── */}
          <section className="border border-white/10 bg-white/[0.02] rounded-xl p-6 md:p-8 space-y-5 hover:border-white/20 hover:bg-white/[0.04] hover:translate-y-[-1px] transition-all duration-200 ease-out animate-fade-in delay-150">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-white/50" />
              <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Daily Brief</h2>
            </div>

            <p className="text-[15px] md:text-[16px] text-white/65 leading-[1.6]">
              Daily overview of relational dynamics, timing windows, and communication patterns.
            </p>

            <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg px-5 py-4 flex items-center justify-center">
              <span className="font-mono text-[11px] md:text-[12px] text-white/35 tracking-[0.2em] uppercase">Coming soon</span>
            </div>
          </section>

          {/* ─── UPGRADE (Solo only) ─── */}
          {!isPlus && (
            <Link href="/unlock" className="block group">
              <section className="border border-white/10 bg-white/[0.02] rounded-xl p-6 md:p-8 group-hover:border-white/20 group-hover:bg-white/[0.04] group-hover:translate-y-[-1px] transition-all duration-200 ease-out animate-fade-in delay-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-3">Upgrade to Plus</h2>
                    <p className="text-[15px] md:text-[16px] text-white/65 leading-[1.6]">
                      Unlock relationship mapping, multi-person dynamics, and priority support.
                    </p>
                  </div>
                  <span className="font-mono text-[15px] md:text-[16px] font-semibold text-white shrink-0 ml-6">
                    $33/mo →
                  </span>
                </div>
              </section>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
