"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, getSession } from "@/lib/supabase";
import { Lock, MessageCircle, Users, Calendar, Headphones, Sparkles } from "lucide-react";
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
        <main className="px-6 pt-12 pb-24 flex flex-col items-center">
          <div className="w-full max-w-[920px]">
            <div className="animate-pulse space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="border border-white/[0.08] bg-white/[0.03] rounded-xl p-7 md:p-8 space-y-4">
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
      <main className="px-6 pt-12 pb-24 flex flex-col items-center">
        <div className="w-full max-w-[920px] space-y-6">

          {/* Today Overview — primary panel */}
          <section className="border border-white/[0.08] bg-white/[0.03] rounded-xl p-7 md:p-8 space-y-6 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/50" />
              <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Today Overview</h2>
            </div>

            <p className="text-[17px] md:text-[20px] leading-[1.6] text-white/70">
              Steady energy today. Good timing for difficult conversations after 2pm.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Pressure', value: 'Medium' },
                { label: 'Timing', value: 'Favorable' },
                { label: 'Best For', value: 'Conversations' },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <span className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/45">{item.label}</span>
                  <p className="text-[15px] md:text-[16px] font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Relationship Map */}
          {isPlus ? (
            <section className="border border-white/[0.08] bg-white/[0.03] rounded-xl p-7 md:p-8 space-y-6 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white/50" />
                  <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Relationship Map</h2>
                </div>
                <Link href="/relationships" className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 hover:text-white/80 transition-colors">
                  View All →
                </Link>
              </div>

              <p className="text-[15px] md:text-[16px] text-white/65 leading-[1.6]">
                {status?.has_relationships
                  ? 'Your active connections and current dynamics.'
                  : 'Add family and team members to map group dynamics.'}
              </p>

              <Link
                href="/relationships"
                className="inline-flex items-center justify-center h-[44px] px-6 border border-white/25 text-white/80 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/50 transition-all duration-200"
              >
                {status?.has_relationships ? 'View Relationships' : 'Add Person'}
              </Link>
            </section>
          ) : (
            <section className="border border-white/[0.06] bg-white/[0.02] rounded-xl p-7 md:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white/30" />
                  <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/30">Relationship Map</h2>
                </div>
                <Lock className="w-4 h-4 text-white/30" />
              </div>
              <p className="text-[15px] md:text-[16px] text-white/40 leading-[1.6]">
                Add family and team members to understand group dynamics.
              </p>
              <Link
                href="/unlock"
                className="inline-flex items-center justify-center h-[44px] px-6 border border-white/15 text-white/60 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/35 transition-all duration-200"
              >
                Upgrade to Plus
              </Link>
            </section>
          )}

          {/* Daily Audio Brief */}
          <section className="border border-white/[0.08] bg-white/[0.03] rounded-xl p-7 md:p-8 space-y-5 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-200">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-white/50" />
              <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Daily Audio Brief</h2>
            </div>

            <p className="text-[15px] md:text-[16px] text-white/65 leading-[1.6]">
              Relationship insights, timing windows, and communication patterns for today.
            </p>

            <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg px-5 py-4 flex items-center justify-center">
              <span className="font-mono text-[11px] md:text-[12px] text-white/35 tracking-[0.2em] uppercase">Coming soon</span>
            </div>
          </section>

          {/* Recent Insights */}
          <section className="border border-white/[0.08] bg-white/[0.03] rounded-xl p-7 md:p-8 space-y-5 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white/50" />
              <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Recent Insights</h2>
            </div>
            <p className="text-[15px] md:text-[16px] text-white/65 leading-[1.6]">
              Patterns and observations from your recent conversations.
            </p>
            <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg px-5 py-4 flex items-center justify-center">
              <span className="font-mono text-[11px] md:text-[12px] text-white/35 tracking-[0.2em] uppercase">Start a chat to generate insights</span>
            </div>
          </section>

          {/* Ask DEFRAG — chat entry */}
          <Link href="/chat" className="block group">
            <section className="border border-white/[0.08] bg-white/[0.03] rounded-xl p-7 md:p-8 space-y-5 group-hover:border-white/20 group-hover:bg-white/[0.05] transition-all duration-200">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-white/50" />
                <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Ask DEFRAG</h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  "Why doesn't my mom respect my boundaries?",
                  "Why does my dad push so hard?",
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

          {/* Upgrade card (Solo users only) */}
          {!isPlus && (
            <Link href="/unlock" className="block group">
              <section className="border border-white/[0.08] bg-white/[0.03] rounded-xl p-7 md:p-8 group-hover:border-white/20 group-hover:bg-white/[0.05] transition-all duration-200">
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
