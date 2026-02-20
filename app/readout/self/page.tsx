'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { BuildStamp } from '@/components/build-stamp';
import { CTAButton } from '@/components/cta-button';
import { useAuth } from '@/lib/auth-context';
import { getSelfReadout, createCheckoutSession, mockSelfReadout, mockLockedReadout } from '@/lib/api';
import type { Readout } from '@/lib/types';

export default function SelfReadoutPage() {
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
    
    // Check for success parameter (returned from Stripe)
    if (searchParams.get('success') === '1') {
      // Reload readout after successful payment
      setTimeout(loadReadout, 1000);
    }
  }, [user, searchParams]);

  const loadReadout = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // TODO: Replace with actual API call when backend is ready
      // const data = await getSelfReadout();
      
      // For now, use mock data - alternate between locked and unlocked
      const useLocked = Math.random() > 0.5;
      const data = useLocked ? mockLockedReadout : mockSelfReadout;
      
      setReadout(data);
      
      // Mark readout as viewed for Add to Home prompt
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

  // Locked state
  if (readout.locked) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation isAuthenticated={true} onSignOut={signOut} />
        
        <main className="flex flex-1 flex-col items-center justify-center px-6 safe-top safe-bottom">
          <div className="flex max-w-md flex-col gap-6 text-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">Your Manual</h1>
              <p className="text-sm text-muted-foreground">
                Unlock your baseline readout
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/20 p-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">Blueprint</h2>
                <p className="text-sm text-muted-foreground">
                  One-time access to your complete baseline analysis
                </p>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$11</span>
                <span className="text-muted-foreground">one-time</span>
              </div>

              <ul className="flex flex-col gap-2 text-left text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-foreground">•</span>
                  <span>Energy Style analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground">•</span>
                  <span>Friction pattern mapping</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground">•</span>
                  <span>Family Echoes identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground">•</span>
                  <span>Daily Weather updates</span>
                </li>
              </ul>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <CTAButton 
                onClick={handleUnlock} 
                disabled={isCheckingOut}
                className="w-full"
              >
                {isCheckingOut ? 'Redirecting...' : 'Unlock Blueprint'}
              </CTAButton>
            </div>
          </div>
        </main>
        
        <BuildStamp />
      </div>
    );
  }

  // Unlocked state
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation isAuthenticated={true} onSignOut={signOut} />
      
      <main className="flex flex-1 flex-col px-6 py-16 safe-top safe-bottom">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Your Manual</h1>
            <p className="text-sm text-muted-foreground">
              {readout.personName || 'You'}
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

          {/* Upgrade CTA */}
          <div className="mt-12 flex flex-col gap-4 rounded-lg border border-border bg-muted/20 p-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">Upgrade to DEFRAG OS</h2>
              <p className="text-sm text-muted-foreground">
                Add your people. Access the Grid. Use Crisis Mode.
              </p>
            </div>
            
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">$33</span>
              <span className="text-muted-foreground">/month</span>
            </div>

            <CTAButton 
              onClick={() => router.push('/grid')}
              className="w-full"
            >
              Learn more
            </CTAButton>
          </div>
        </div>
      </main>
      
      <BuildStamp />
    </div>
  );
}
