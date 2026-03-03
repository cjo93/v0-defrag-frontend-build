'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getConnectionReadout, createCheckoutSession } from '@/lib/api';
import type { Readout } from '@/lib/types';
import { 
  AppShell, 
  EditorialRail, 
  MicroLabel, 
  H1, 
  H2,
  Body, 
  Spacer,
  LoadingScreen,
  LockedScreen 
} from '@/components/editorial';
import { BuildStamp } from '@/components/build-stamp';

export default function ConnectionReadoutPage() {
  const router = useRouter();
  const params = useParams();
  const { user, signOut } = useAuth();
  const nodeId = params.nodeId as string;
  
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
  }, [user, nodeId]);

  const loadReadout = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // TODO: Replace with actual API call when backend is ready
      const data: Readout = {
        locked: true,
        required: 'os',
      };
      
      setReadout(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load readout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
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

  if (!readout) {
    return (
      <AppShell>
        <EditorialRail variant="app">
          <H1>Error</H1>
          <Spacer size="m" />
          <Body muted>{error || 'Failed to load readout'}</Body>
        </EditorialRail>
        <BuildStamp />
      </AppShell>
    );
  }

  // Locked state (requires OS)
  if (readout.locked && readout.required === 'os') {
    return (
      <LockedScreen
        title="Connection readout locked"
        description="Requires DEFRAG OS to view connection analysis."
        productName="DEFRAG OS"
        price="$33"
        priceInterval="month"
        features={[
          'Relational Grid for your network',
          'Connection readouts',
          'Crisis Mode AI support',
          'Network tension mapping'
        ]}
        onUnlock={handleUpgrade}
        isProcessing={isCheckingOut}
        error={error}
      />
    );
  }

  // Unlocked state (with OS access)
  return (
    <AppShell>
      <EditorialRail variant="app">
        <MicroLabel>Connection</MicroLabel>
        <Spacer size="s" />
        <H1>{readout.personName || 'Connection'}</H1>
        
        <Spacer size="xl" />

        {/* Insights - vertical block layout */}
        <div className="space-y-20">
          {readout.insights?.map((insight, index) => (
            <div key={index}>
              <H2>{insight.title}</H2>
              <Spacer size="m" />
              <Body>{insight.content}</Body>
            </div>
          ))}
        </div>
      </EditorialRail>
      
      <BuildStamp />
    </AppShell>
  );
}
