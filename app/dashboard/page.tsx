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
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-[#111]" />
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 bg-[#111] border border-[#333]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center border-b border-[#333] pb-4 mb-8">
        <h1 className="text-xl font-bold tracking-widest">DEFRAG</h1>
        <Link href="/settings" className="text-xs text-gray-500 hover:text-white transition-colors">
          Settings
        </Link>
      </header>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        
        {/* Panel 1: Today (Pressure + timing) */}
        <div className="border border-[#333] p-6 bg-[#0a0a0a] space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm uppercase tracking-widest text-gray-400">Today</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-[#222] pb-2">
              <span className="text-sm text-gray-300">Current Pressure</span>
              <span className="text-sm font-medium">Medium</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#222] pb-2">
              <span className="text-sm text-gray-300">Timing Window</span>
              <span className="text-sm font-medium">Favorable</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Best for</span>
              <span className="text-sm font-medium">Conversations</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 pt-2">
            Steady energy today. Good timing for difficult conversations after 2pm.
          </p>
        </div>

        {/* Panel 2: Ask (Chat entry) */}
        <Link href="/chat" className="block">
          <div className="border border-[#333] p-6 bg-[#0a0a0a] space-y-4 h-full hover:border-white transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm uppercase tracking-widest text-gray-400">Ask</h2>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-300">Ask about your relationships</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p>• Why doesn't my mom respect my boundaries?</p>
                <p>• Why does my dad push so hard?</p>
                <p>• How do I say this without escalation?</p>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-sm font-bold tracking-wider">START CHAT →</span>
            </div>
          </div>
        </Link>

        {/* Panel 3: Relationships (locked unless Plus) */}
        {isPlus ? (
          <Link href="/relationships" className="block">
            <div className="border border-[#333] p-6 bg-[#0a0a0a] space-y-4 h-full hover:border-white transition-colors cursor-pointer">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm uppercase tracking-widest text-gray-400">Relationships</h2>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  {status?.has_relationships 
                    ? 'View your relationship graph' 
                    : 'Add family and team members'}
                </p>
                <p className="text-xs text-gray-500">
                  Understand dynamics and timing for each person.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-sm font-bold tracking-wider">
                  {status?.has_relationships ? 'VIEW RELATIONSHIPS →' : 'ADD PERSON →'}
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="border border-[#333] p-6 bg-[#0a0a0a] space-y-4 opacity-60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm uppercase tracking-widest text-gray-400">Relationships</h2>
              </div>
              <Lock className="w-4 h-4 text-gray-500" />
            </div>
            
            <p className="text-sm text-gray-400">
              Add family and team members to understand group dynamics.
            </p>
            
            <Link 
              href="/unlock" 
              className="inline-block text-sm font-bold tracking-wider text-white hover:underline"
            >
              UPGRADE TO PLUS →
            </Link>
          </div>
        )}

        {/* Panel 4: Daily Audio */}
        <div className="border border-[#333] p-6 bg-[#0a0a0a] space-y-4">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm uppercase tracking-widest text-gray-400">Daily Audio</h2>
          </div>
          
          <p className="text-sm text-gray-300">
            Your personalized daily briefing
          </p>
          
          <p className="text-xs text-gray-500">
            Family dynamics, timing windows, and communication patterns for today.
          </p>

          <div className="pt-2">
            <div className="bg-[#111] border border-[#333] p-3 text-center">
              <span className="text-xs text-gray-500">Audio coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
