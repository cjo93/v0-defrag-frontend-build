'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import SystemMapHero from './components/landing/SystemMapHero';
import Hero from './components/landing/Hero'
import QuietTruth from './components/landing/QuietTruth'
import WhatWeBelieve from './components/landing/WhatWeBelieve'
import WhatDefragDoes from './components/landing/WhatDefragDoes'
import InsideDashboard from './components/landing/InsideDashboard'
import TimingMatters from './components/landing/TimingMatters'
import WhatChanges from './components/landing/WhatChanges'
import PrivateByDesign from './components/landing/PrivateByDesign'
import FinalCTA from './components/landing/FinalCTA'

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <main
      style={{
        background: 'var(--bg-black)',
        minHeight: '100vh',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Hero />
      <SystemMapHero />
      <QuietTruth />
      <WhatWeBelieve />
      <WhatDefragDoes />
      <InsideDashboard />
      <TimingMatters />
      <WhatChanges />
      <PrivateByDesign />
      <FinalCTA />
    </main>
  )
}
