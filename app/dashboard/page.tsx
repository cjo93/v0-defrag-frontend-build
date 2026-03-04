"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, getSession } from "@/lib/supabase";
import { Lock, MessageCircle, Users, Calendar, Headphones } from "lucide-react";
import Link from "next/link";

type UserStatus = {
  plan: 'basic' | 'plus';
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
          plan: profile?.plan || 'basic',
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
      <div className="min-h-screen bg-black text-white font-mono p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <div className="animate-pulse space-y-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="h-6 w-24 bg-white/[0.06]" />
              <div className="h-4 w-16 bg-white/[0.04]" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
                  <div className="h-3 w-20 bg-white/[0.06]" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-white/[0.04]" />
                    <div className="h-4 w-3/4 bg-white/[0.04]" />
                  </div>
                  <div className="h-3 w-28 bg-white/[0.06]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center border-b border-white/10 pb-6 mb-8">
        <h1 className="text-xl font-bold tracking-[0.2em]">DEFRAG</h1>
        <Link href="/settings" className="text-xs text-white/40 hover:text-white/80 transition-colors duration-200 tracking-widest uppercase">
          Settings
        </Link>
      </header>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        
        {/* Panel 1: Today */}
        <div className="border border-white/10 p-6 bg-white/[0.02] space-y-4 hover:border-white/20 transition-colors duration-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/40" />
            <h2 className="font-mono text-[12px] uppercase tracking-widest text-white/40">Today</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
              <span className="text-[14px] text-white/60">Current Pressure</span>
              <span className="text-[14px] font-medium text-white">Medium</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
              <span className="text-[14px] text-white/60">Timing Window</span>
              <span className="text-[14px] font-medium text-white">Favorable</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-white/60">Best for</span>
              <span className="text-[14px] font-medium text-white">Conversations</span>
            </div>
          </div>
          
          <p className="text-[12px] text-white/30 pt-2 leading-relaxed">
            Steady energy today. Good timing for difficult conversations after 2pm.
          </p>
        </div>

        {/* Panel 2: Ask (Chat entry) */}
        <Link href="/chat" className="block">
          <div className="border border-white/10 p-6 bg-white/[0.02] space-y-4 h-full hover:border-white/20 hover:bg-white/[0.03] transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-white/40" />
              <h2 className="font-mono text-[12px] uppercase tracking-widest text-white/40">Ask</h2>
            </div>
            
            <div className="space-y-2">
              <p className="text-[14px] text-white/70">Ask about your relationships</p>
              <div className="space-y-1 text-[12px] text-white/30">
                <p>• Why doesn't my mom respect my boundaries?</p>
                <p>• Why does my dad push so hard?</p>
                <p>• How do I say this without escalation?</p>
              </div>
            </div>

            <div className="pt-2">
              <span className="font-mono text-[13px] font-bold tracking-wider text-white">START CHAT →</span>
            </div>
          </div>
        </Link>

        {/* Panel 3: Relationships (locked unless Plus) */}
        {isPlus ? (
          <Link href="/relationships" className="block">
            <div className="border border-white/10 p-6 bg-white/[0.02] space-y-4 h-full hover:border-white/20 hover:bg-white/[0.03] transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-white/40" />
                <h2 className="font-mono text-[12px] uppercase tracking-widest text-white/40">Relationships</h2>
              </div>
              
              <div className="space-y-2">
                <p className="text-[14px] text-white/70">
                  {status?.has_relationships 
                    ? 'View your relationship graph' 
                    : 'Add family and team members'}
                </p>
                <p className="text-[12px] text-white/30">
                  Understand dynamics and timing for each person.
                </p>
              </div>

              <div className="pt-2">
                <span className="font-mono text-[13px] font-bold tracking-wider text-white">
                  {status?.has_relationships ? 'VIEW RELATIONSHIPS →' : 'ADD PERSON →'}
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="border border-white/[0.06] p-6 bg-white/[0.01] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-white/20" />
                <h2 className="font-mono text-[12px] uppercase tracking-widest text-white/20">Relationships</h2>
              </div>
              <Lock className="w-4 h-4 text-white/20" />
            </div>
            
            <p className="text-[14px] text-white/30">
              Add family and team members to understand group dynamics.
            </p>
            
            <Link 
              href="/unlock" 
              className="inline-block font-mono text-[13px] font-bold tracking-wider text-white hover:text-white/80 transition-colors duration-200"
            >
              UPGRADE TO PLUS →
            </Link>
          </div>
        )}

        {/* Panel 4: Daily Audio */}
        <div className="border border-white/10 p-6 bg-white/[0.02] space-y-4 hover:border-white/20 transition-colors duration-200">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-white/40" />
            <h2 className="font-mono text-[12px] uppercase tracking-widest text-white/40">Daily Audio</h2>
          </div>
          
          <p className="text-[14px] text-white/70">
            Your personalized daily briefing
          </p>
          
          <p className="text-[12px] text-white/30 leading-relaxed">
            Relationship insights, timing windows, and communication patterns for today.
          </p>

          <div className="pt-2">
            <div className="bg-white/[0.02] border border-white/[0.06] p-3 text-center">
              <span className="font-mono text-[11px] text-white/25 tracking-wider">Coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
