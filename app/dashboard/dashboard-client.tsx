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

export default function DashboardClient() {
  const router = useRouter();
  const { user } = useAuth();

  const [isReady, setIsReady] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    // Simulate loading data
    setIsReady(true);

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
          {/* SECTION 1 - Relational Dynamics */}
          <section>
            <H1>Your relational dynamics</H1>
            <Spacer size="l" />

            <div className="space-y-8">
              <div className="border border-white/20 p-6 bg-black">
                <MicroLabel>Dynamic</MicroLabel>
                <Spacer size="s" />
                <H2 className="text-white text-lg font-medium tracking-tight">Strong responsibility patterns in family relationships</H2>
                <Spacer size="m" />
                <MicroLabel>Meaning</MicroLabel>
                <Spacer size="xs" />
                <Body className="text-white/70">You may often be expected to carry emotional or practical responsibility within your family system.</Body>
              </div>

              <div className="border border-white/20 p-6 bg-black">
                <MicroLabel>Dynamic</MicroLabel>
                <Spacer size="s" />
                <H2 className="text-white text-lg font-medium tracking-tight">High sensitivity to authority figures</H2>
                <Spacer size="m" />
                <MicroLabel>Meaning</MicroLabel>
                <Spacer size="xs" />
                <Body className="text-white/70">Pressure or expectations from authority may feel unusually intense.</Body>
              </div>
            </div>
          </section>

          <Spacer size="xl" />
          <div className="h-px w-full bg-white/10" />
          <Spacer size="xl" />

          {/* SECTION 2 - Ask about a relationship */}
          <section>
            <H1>Ask about a relationship in your life</H1>
            <Spacer size="l" />

            <div
              className="border border-white/30 p-4 mb-6 cursor-text hover:border-white/50 transition-colors"
              onClick={() => router.push('/chat')}
            >
              <span className="font-sans text-[16px] text-white/40">Example: Why does my dad push me so hard?</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 cursor-pointer group" onClick={() => router.push('/chat?prompt=Why+does+my+mom+struggle+to+respect+my+boundaries%3F')}>
                <div className="h-px w-6 bg-white/20 mt-3 group-hover:bg-white/50 transition-colors" />
                <Body className="text-white/70 group-hover:text-white transition-colors">Why does my mom struggle to respect my boundaries?</Body>
              </div>

              <div className="flex items-start gap-4 cursor-pointer group" onClick={() => router.push('/chat?prompt=Why+do+people+expect+me+to+take+responsibility+for+everything%3F')}>
                <div className="h-px w-6 bg-white/20 mt-3 group-hover:bg-white/50 transition-colors" />
                <Body className="text-white/70 group-hover:text-white transition-colors">Why do people expect me to take responsibility for everything?</Body>
              </div>

              <div className="flex items-start gap-4 cursor-pointer group" onClick={() => router.push('/chat?prompt=Why+do+partners+pull+away+when+I+get+close%3F')}>
                <div className="h-px w-6 bg-white/20 mt-3 group-hover:bg-white/50 transition-colors" />
                <Body className="text-white/70 group-hover:text-white transition-colors">Why do partners pull away when I get close?</Body>
              </div>
            </div>
          </section>

          <Spacer size="xl" />
          <div className="h-px w-full bg-white/10" />
          <Spacer size="xl" />

          {/* SECTION 3 - Current Dynamics */}
          <section>
            <H1>Current dynamics</H1>
            <Spacer size="l" />

            <div className="border border-white/20 p-6 bg-black">
              <MicroLabel>Current Dynamic</MicroLabel>
              <Spacer size="s" />
              <H2 className="text-white text-lg font-medium tracking-tight">Communication pressure</H2>
              <Spacer size="m" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <MicroLabel>Meaning</MicroLabel>
                  <Spacer size="xs" />
                  <Body className="text-white/70">Conversations may feel more intense right now.</Body>
                </div>
                <div>
                  <MicroLabel>Advice</MicroLabel>
                  <Spacer size="xs" />
                  <Body className="text-white/70">Keep responses short and clear.</Body>
                </div>
              </div>
            </div>
          </section>

          <Spacer size="xxl" />
        </div>
      </EditorialRail>

      <BuildStamp />
    </AppShell>
  );
}
