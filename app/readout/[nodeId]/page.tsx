'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { BuildStamp } from '@/components/build-stamp';
import { CTAButton } from '@/components/cta-button';
import { useAuth } from '@/lib/auth-context';
import { getConnectionReadout, createCheckoutSession } from '@/lib/api';
import type { Readout } from '@/lib/types';

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
      // const data = await getConnectionReadout(nodeId);
      
      // For now, return locked state (requires OS)
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
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation isAuthenticated={true} onSignOut={signOut} />
        <main className="flex flex-1 items-center justify-center safe-top safe-bottom">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <BuildStamp />
      </div>
    );
  }

  if (!readout) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation isAuthenticated={true} onSignOut={signOut} />
        <main className="flex flex-1 items-center justify-center px-6 safe-top safe-bottom">
          <div className="flex max-w-md flex-col gap-4 text-center">
            <h1 className="text-2xl font-bold">Error</h1>
            <p className="text-muted-foreground">{error || 'Failed to load readout'}</p>
            <CTAButton onClick={loadReadout}>Retry</CTAButton>
          </div>
        </main>
        <BuildStamp />
      </div>
    );
  }

  // Locked state (requires OS)
  if (readout.locked && readout.required === 'os') {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation isAuthenticated={true} onSignOut={signOut} />
        
        <main className="flex flex-1 flex-col items-center justify-center px-6 safe-top safe-bottom">
          <div className="flex max-w-md flex-col gap-6 text-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">Upgrade Required</h1>
              <p className="text-sm text-muted-foreground">
                Connection readouts require DEFRAG OS
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/20 p-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">DEFRAG OS</h2>
                <p className="text-sm text-muted-foreground">
                  Full access to Grid, Crisis Mode, and connection analysis
                </p>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$33</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="flex flex-col gap-2 text-left text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-foreground">•</span>
                  <span>Relational Grid for your network</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground">•</span>
                  <span>Connection readouts for your people</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground">•</span>
                  <span>Crisis Mode AI support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground">•</span>
                  <span>Network tension mapping</span>
                </li>
              </ul>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <CTAButton 
                onClick={handleUpgrade} 
                disabled={isCheckingOut}
                className="w-full"
              >
                {isCheckingOut ? 'Redirecting...' : 'Upgrade to DEFRAG OS'}
              </CTAButton>
            </div>
          </div>
        </main>
        
        <BuildStamp />
      </div>
    );
  }

  // Unlocked state (with OS access)
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation isAuthenticated={true} onSignOut={signOut} />
      
      <main className="flex flex-1 flex-col px-6 py-16 safe-top safe-bottom">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold">{readout.personName || 'Connection'}</h1>
            <p className="text-sm text-muted-foreground">
              Connection Analysis
            </p>
          </div>

          {/* Insights */}
          <div className="flex flex-col gap-6">
            {readout.insights?.map((insight, index) => (
              <div 
                key={index}
                className="flex flex-col gap-3 border-l-2 border-border pl-4"
              >
                <h2 className="text-lg font-semibold">{insight.title}</h2>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {insight.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <BuildStamp />
    </div>
  );
}
