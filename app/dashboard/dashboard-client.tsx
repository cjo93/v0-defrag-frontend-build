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
  Spacer
} from '@/components/editorial';
import { BuildStamp } from '@/components/build-stamp';

export default function DashboardClient() {
  const router = useRouter();
  const { user } = useAuth();

  const [isReady, setIsReady] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // Mock data to simulate presence/absence of data
  const [data] = useState({
    today: {
      hasData: true, // change this to test missing data
      pressure: "Medium",
      advice: "Keep responses short and clear."
    },
    relationships: {
      hasData: true,
      dynamics: [
        { title: "Strong responsibility patterns in family relationships" },
        { title: "High sensitivity to authority figures" }
      ]
    },
    dailyAudio: {
      hasData: true
    }
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setIsReady(true);

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

          <H1>Intelligence Console</H1>
          <Spacer size="l" />

          {/* PANEL 1: Today */}
          <section>
            <MicroLabel>Today</MicroLabel>
            <Spacer size="s" />

            <div className="border border-white/20 p-6 bg-black">
              {data.today.hasData ? (
                <>
                  <H2 className="text-white text-lg font-medium tracking-tight">Communication pressure</H2>
                  <Spacer size="s" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <MicroLabel>Pressure</MicroLabel>
                      <Spacer size="s" />
                      <Body className="text-white/70">{data.today.pressure}</Body>
                    </div>
                    <div>
                      <MicroLabel>Advice</MicroLabel>
                      <Spacer size="s" />
                      <Body className="text-white/70">{data.today.advice}</Body>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/dashboard')}>
                   <Body className="text-white">Generate today's brief</Body>
                </div>
              )}
            </div>
          </section>

          <Spacer size="xl" />

          {/* PANEL 2: Relationships */}
          <section>
            <MicroLabel>Relationships</MicroLabel>
            <Spacer size="s" />

            <div className="border border-white/20 p-6 bg-black">
              {data.relationships.hasData ? (
                <div className="space-y-6">
                  {data.relationships.dynamics.map((d, i) => (
                    <div key={i} className={i !== 0 ? "border-t border-white/10 pt-6" : ""}>
                       <H2 className="text-white text-lg font-medium tracking-tight">{d.title}</H2>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-6 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/relationships/new')}>
                      <MicroLabel>+ Add Connection</MicroLabel>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/relationships/new')}>
                   <Body className="text-white">Add someone</Body>
                </div>
              )}
            </div>
          </section>

          <Spacer size="xl" />

          {/* PANEL 3: Daily Audio */}
          <section>
            <MicroLabel>Daily Audio</MicroLabel>
            <Spacer size="s" />

            <div className="border border-white/20 p-6 bg-black flex flex-col items-center justify-center">
              {data.dailyAudio.hasData ? (
                <audio controls className="w-full max-w-sm h-10" src="/api/audio/daily" />
              ) : (
                <div className="text-center py-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/dashboard')}>
                   <Body className="text-white">Generate today's brief</Body>
                </div>
              )}
            </div>
          </section>

          <Spacer size="xl" />

          {/* PANEL 4: Ask About a Relationship */}
          <section>
            <MicroLabel>Ask About a Relationship</MicroLabel>
            <Spacer size="s" />

            <div className="border border-white/20 p-6 bg-black">
              {data.relationships.hasData ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4 cursor-pointer group" onClick={() => router.push('/chat?prompt=Why+does+my+mom+respect+my+boundaries%3F')}>
                    <div className="h-px w-6 bg-white/20 mt-3 group-hover:bg-white/50 transition-colors" />
                    <Body className="text-white/70 group-hover:text-white transition-colors">Why doesn't my mom respect my boundaries?</Body>
                  </div>

                  <div className="flex items-start gap-4 cursor-pointer group" onClick={() => router.push('/chat?prompt=Why+does+my+dad+push+me+so+hard%3F')}>
                    <div className="h-px w-6 bg-white/20 mt-3 group-hover:bg-white/50 transition-colors" />
                    <Body className="text-white/70 group-hover:text-white transition-colors">Why does my dad push me so hard?</Body>
                  </div>

                  <div className="flex items-start gap-4 cursor-pointer group" onClick={() => router.push('/chat?prompt=Why+can%27t+they+see+who+I+am%3F')}>
                    <div className="h-px w-6 bg-white/20 mt-3 group-hover:bg-white/50 transition-colors" />
                    <Body className="text-white/70 group-hover:text-white transition-colors">Why can't they see who I am?</Body>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/chat')}>
                   <Body className="text-white">Ask about a relationship</Body>
                </div>
              )}
            </div>
          </section>

          <Spacer size="xl" />
        </div>
      </EditorialRail>

      <BuildStamp />
    </AppShell>
  );
}
