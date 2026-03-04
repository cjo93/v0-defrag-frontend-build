'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  AppShell,
  EditorialRail,
  MicroLabel,
  H1,
  H2,
  Body,
  Spacer,
  TextActionButton
} from '@/components/editorial';
import { BuildStamp } from '@/components/build-stamp';
import { getSession } from '@/lib/supabase';

export default function DashboardClient() {
  const router = useRouter();
  const { user } = useAuth();

  const [isReady, setIsReady] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const checkData = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const supabaseClient = supabase;
        const { data } = await supabaseClient!
          .from('connections')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        setHasData(!!(data && data.length > 0));
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setIsReady(true);
      }
    };
    checkData();

    // Auto-hide banner after 5 seconds
    const timer = setTimeout(() => {
      setShowBanner(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [user, router]);

  if (!isReady) {
    return (
      <AppShell>
        <div className="flex h-screen items-center justify-center bg-black">
          <span className="font-mono text-[12px] text-white/50 uppercase tracking-widest">Initializing...</span>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white text-black py-2 px-6 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest font-medium">Natal profile loaded successfully</span>
        </div>
      )}

      <EditorialRail variant="app">
        <div className={showBanner ? "pt-10" : ""}>
          {!hasData ? (
            <div className="border border-white/20 p-8 mt-12 bg-[#111] text-center">
              <H2>Awaiting input.</H2>
              <Spacer size="m" />
              <Body>To generate insights, DEFRAG requires relational data.</Body>
              <Spacer size="l" />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => router.push('/relationships/new')}
                  className="px-6 py-3 bg-white text-black font-mono text-[12px] tracking-widest uppercase hover:bg-gray-200 transition-colors w-full sm:w-auto"
                >
                  Add someone
                </button>
                <button
                  onClick={() => router.push('/dashboard/today')}
                  className="px-6 py-3 border border-white/30 text-white font-mono text-[12px] tracking-widest uppercase hover:bg-white/10 transition-colors w-full sm:w-auto"
                >
                  Generate today's brief
                </button>
                <button
                  onClick={() => router.push('/chat')}
                  className="px-6 py-3 border border-white/30 text-white font-mono text-[12px] tracking-widest uppercase hover:bg-white/10 transition-colors w-full sm:w-auto"
                >
                  Ask about a relationship
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* PANEL 1 - Today */}
              <section>
                <H1>Today</H1>
                <Spacer size="l" />
                <div className="border border-white/20 p-6 bg-black">
                  <MicroLabel>Pressure</MicroLabel>
                  <Spacer size="s" />
                  <H2 className="text-white text-lg font-medium tracking-tight">Communication pressure</H2>
                  <Spacer size="m" />
                  <Body className="text-white/70">Conversations may feel more intense right now. Keep responses short and clear.</Body>
                </div>
              </section>

              <Spacer size="xl" />
              <div className="h-px w-full bg-white/10" />
              <Spacer size="xl" />

              {/* PANEL 2 - Relationships */}
              <section>
                <H1>Relationships</H1>
                <Spacer size="l" />
                <div className="space-y-4">
                  <div className="flex items-start gap-4 cursor-pointer group" onClick={() => router.push('/relationships')}>
                    <div className="h-px w-6 bg-white/20 mt-3 group-hover:bg-white/50 transition-colors" />
                    <Body className="text-white/70 group-hover:text-white transition-colors">View all connections</Body>
                  </div>
                </div>
              </section>

              <Spacer size="xl" />
              <div className="h-px w-full bg-white/10" />
              <Spacer size="xl" />

              {/* PANEL 3 - Daily Audio */}
              <section>
                <H1>Daily Audio</H1>
                <Spacer size="l" />
                <div className="border border-white/20 p-6 bg-black flex items-center justify-between opacity-50">
                  <Body className="text-white/70">Audio generation currently offline.</Body>
                </div>
              </section>

              <Spacer size="xl" />
              <div className="h-px w-full bg-white/10" />
              <Spacer size="xl" />

              {/* PANEL 4 - Ask About a Relationship */}
              <section>
                <H1>Ask about a relationship</H1>
                <Spacer size="l" />
                <div
                  className="border border-white/30 p-4 mb-6 cursor-text hover:border-white/50 transition-colors"
                  onClick={() => router.push('/chat')}
                >
                  <span className="font-sans text-[16px] text-white/40">Example: Why does my dad push me so hard?</span>
                </div>
              </section>
            </>
          )}

          <Spacer size="xxl" />
        </div>
      </EditorialRail>

      <BuildStamp />
    </AppShell>
  );
}
