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

        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('user_id', session.user.id)
          .single();

        // Count connections
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
      <div className="min-h-screen bg-black text-white">
        <TopNav />
        <main className="px-6 pt-12 pb-24 flex flex-col items-center">
          <div className="w-full max-w-[920px]">
            <div className="animate-pulse space-y-12">
              {/* Skeleton: Today Overview */}
              <div className="border border-white/[0.06] bg-white/[0.02] rounded-xl p-6 space-y-4">
                <div className="h-3 w-24 bg-white/[0.06] rounded" />
                <div className="h-5 w-2/3 bg-white/[0.04] rounded" />
                <div className="h-4 w-full bg-white/[0.04] rounded" />
                <div className="h-4 w-4/5 bg-white/[0.04] rounded" />
              </div>
              {/* Skeleton: Panels */}
              {[1, 2, 3].map(i => (
                <div key={i} className="border border-white/[0.06] bg-white/[0.02] rounded-xl p-6 space-y-4">
                  <div className="h-3 w-20 bg-white/[0.06] rounded" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-white/[0.04] rounded" />
                    <div className="h-4 w-3/4 bg-white/[0.04] rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <TopNav />
      <main className="px-6 pt-12 pb-24 flex flex-col items-center">
        <div className="w-full max-w-[920px] space-y-12">

          {/* Today Overview — primary panel */}
          <section className="border border-white/10 rounded-xl p-6 bg-white/[0.02] space-y-6 hover:border-white/20 transition-colors duration-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/40" />
              <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">Today Overview</h2>
            </div>

            <p className="font-serif text-[18px] leading-relaxed text-white/80">
              Steady energy today. Good timing for difficult conversations after 2pm.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/30">Pressure</span>
                <p className="text-[14px] font-medium text-white">Medium</p>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/30">Timing</span>
                <p className="text-[14px] font-medium text-white">Favorable</p>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/30">Best For</span>
                <p className="text-[14px] font-medium text-white">Conversations</p>
              </div>
            </div>
          </section>

          {/* Relationship Map */}
          {isPlus ? (
            <section className="border border-white/10 rounded-xl p-6 bg-white/[0.02] space-y-6 hover:border-white/20 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white/40" />
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">Relationship Map</h2>
                </div>
                <Link href="/relationships" className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40 hover:text-white/80 transition-colors">
                  View All →
                </Link>
              </div>

              <p className="text-[14px] text-white/60">
                {status?.has_relationships
                  ? 'Your active connections and current dynamics.'
                  : 'Add family and team members to map group dynamics.'}
              </p>

              <Link
                href="/relationships"
                className="inline-flex items-center gap-2 font-mono text-[13px] font-bold tracking-wider text-white hover:text-white/80 transition-colors"
              >
                {status?.has_relationships ? 'VIEW RELATIONSHIPS →' : 'ADD PERSON →'}
              </Link>
            </section>
          ) : (
            <section className="border border-white/[0.06] rounded-xl p-6 bg-white/[0.01] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white/20" />
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/20">Relationship Map</h2>
                </div>
                <Lock className="w-4 h-4 text-white/20" />
              </div>
              <p className="text-[14px] text-white/30">
                Add family and team members to understand group dynamics.
              </p>
              <Link
                href="/unlock"
                className="inline-block font-mono text-[13px] font-bold tracking-wider text-white hover:text-white/80 transition-colors"
              >
                UPGRADE TO PLUS →
              </Link>
            </section>
          )}

          {/* Daily Audio Brief */}
          <section className="border border-white/10 rounded-xl p-6 bg-white/[0.02] space-y-4 hover:border-white/20 transition-colors duration-200">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-white/40" />
              <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">Daily Audio Brief</h2>
            </div>

            <p className="text-[14px] text-white/60">
              Relationship insights, timing windows, and communication patterns for today.
            </p>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4 flex items-center justify-center">
              <span className="font-mono text-[11px] text-white/25 tracking-wider uppercase">Coming soon</span>
            </div>
          </section>

          {/* Recent Insights */}
          <section className="border border-white/10 rounded-xl p-6 bg-white/[0.02] space-y-4 hover:border-white/20 transition-colors duration-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white/40" />
              <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">Recent Insights</h2>
            </div>
            <p className="text-[14px] text-white/60">
              Patterns and observations from your recent conversations.
            </p>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4 flex items-center justify-center">
              <span className="font-mono text-[11px] text-white/25 tracking-wider uppercase">Start a chat to generate insights</span>
            </div>
          </section>

          {/* Ask DEFRAG — chat entry */}
          <Link href="/chat" className="block group">
            <section className="border border-white/10 rounded-xl p-6 bg-white/[0.02] space-y-4 group-hover:border-white/20 group-hover:bg-white/[0.03] transition-all duration-200">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-white/40" />
                <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">Ask DEFRAG</h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  "Why doesn't my mom respect my boundaries?",
                  "Why does my dad push so hard?",
                  "How do I say this without escalation?",
                ].map((prompt, i) => (
                  <div key={i} className="border border-white/[0.06] rounded-lg p-3 text-[13px] text-white/50 hover:border-white/20 hover:text-white/70 transition-colors">
                    {prompt}
                  </div>
                ))}
              </div>

              <span className="inline-block font-mono text-[13px] font-bold tracking-wider text-white group-hover:text-white/80 transition-colors">
                START CHAT →
              </span>
            </section>
          </Link>

          {/* Upgrade card (Solo users only) */}
          {!isPlus && (
            <Link href="/unlock" className="block group">
              <section className="border border-white/[0.06] rounded-xl p-6 bg-white/[0.01] group-hover:border-white/10 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40 mb-2">Upgrade to Plus</h2>
                    <p className="text-[14px] text-white/50">
                      Unlock relationship mapping, multi-person dynamics, and priority support.
                    </p>
                  </div>
                  <span className="font-mono text-[13px] font-bold tracking-wider text-white shrink-0 ml-6">
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
