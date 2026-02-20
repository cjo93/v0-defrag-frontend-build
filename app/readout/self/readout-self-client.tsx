'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getSelfReadout, createCheckoutSession, mockSelfReadout, mockLockedReadout } from '@/lib/api';
import type { Readout } from '@/lib/types';
import { 
  AppShell, 
  EditorialRail, 
  MicroLabel, 
  H1, 
  H2,
  Body, 
  Spacer,
  TextActionButton,
  LoadingScreen,
  LockedScreen 
} from '@/components/editorial';
import { BuildStamp } from '@/components/build-stamp';

export default function SelfReadoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signOut } = useAuth();
  
  const [readout, setReadout] = useState<Readout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    loadReadout();
    
    if (searchParams.get('success') === '1') {
      setTimeout(loadReadout, 1000);
    }
  }, [user, searchParams]);

  const loadReadout = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // TODO: Replace with actual API call when backend is ready
      const useLocked = Math.random() > 0.5;
      const data = useLocked ? mockLockedReadout : mockSelfReadout;
      
      setReadout(data);
      
      if (!data.locked) {
        localStorage.setItem('defrag-viewed-readout', 'true');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load readout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = async () => {
    setIsCheckingOut(true);
    setError('');
    
    try {
      const { url } = await createCheckoutSession('blueprint');
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout session');
      setIsCheckingOut(false);
    }
  };

  const handleUpgradeOS = async () => {
    setIsCheckingOut(true);
    setError('');
    
    try {
      const { url } = await createCheckoutSession('os');
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout session');
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Locked state
  if (readout?.locked) {
    return (
      <LockedScreen
        title="Manual locked"
        description="Your baseline is set. Unlock to view it."
        productName="Blueprint"
        price="$11"
        priceInterval="one-time"
        features={[
          'Energy Style analysis',
          'Friction patterns',
          'Family Echoes',
          'Daily Weather forecast'
        ]}
        onUnlock={handleUnlock}
        isProcessing={isCheckingOut}
        error={error}
      />
    );
  }

  // Unlocked readout
  return (
    <AppShell>
      <EditorialRail width="app">
        <MicroLabel>Manual</MicroLabel>
        <Spacer size="s" />
        <H1>Your Manual</H1>
        
        <Spacer size="xl" />

        {/* Readout sections - with dividers between */}
        {readout?.insights?.map((insight, index) => (
          <div key={index}>
            {index > 0 && <div className="mb-20 h-px w-full bg-white/8" />}
            <H2>{insight.title}</H2>
            <Spacer size="m" />
            <Body>{insight.content}</Body>
            <Spacer size="xl" />
          </div>
        ))}

        {/* Upgrade CTA - silent reference */}
        <Spacer size="xl" />
        <div className="pt-12 border-t border-white/10">
          <Body muted>Add your people and access Crisis Mode</Body>
          <Spacer size="m" />
          <TextActionButton onClick={handleUpgradeOS} disabled={isCheckingOut}>
            {isCheckingOut ? 'Redirecting...' : 'Upgrade to OS'}
          </TextActionButton>
        </div>
      </EditorialRail>
      
      <BuildStamp />
    </AppShell>
  );
}
