'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { BuildStamp } from '@/components/build-stamp';
import { CTAButton } from '@/components/cta-button';
import { useAuth } from '@/lib/auth-context';
import { getSelfReadout, createCheckoutSession, mockSelfReadout, mockLockedReadout } from '@/lib/api';
import type { Readout } from '@/lib/types';

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
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-[14px] text-white/40">Loading...</p>
        <BuildStamp />
      </div>
    );
  }

  // Locked state
  if (readout?.locked) {
    return (
      <div className="min-h-screen bg-black text-white flex items-start pt-32">
        <div className="w-full max-w-[520px] mx-auto px-6 md:px-8">
          <div>
            <h1 className="font-display text-[38px] md:text-[46px] leading-[1.18] tracking-[-0.015em] font-normal mb-7">
              Your Manual
            </h1>
            <p className="text-[15px] text-white/45 leading-[1.7] max-w-[420px] mb-20">
              Unlock your complete baseline readout
            </p>
          </div>

          <div className="space-y-6">
            <div className="mb-12">
              <h2 className="font-display text-[24px] leading-[1.3] tracking-[-0.01em] font-normal mb-2">
                Blueprint
              </h2>
              <p className="text-[15px] text-white/45">
                Your complete baseline analysis
              </p>
            </div>
            
            <div className="flex items-baseline gap-2 mb-10">
              <span className="font-display text-[42px] leading-none">$11</span>
              <span className="text-[13px] text-white/40">one-time</span>
            </div>

            <ul className="space-y-3 text-[14px] text-white/60 mb-16">
              <li>Energy Style analysis</li>
              <li>Friction patterns</li>
              <li>Family Echoes</li>
              <li>Daily Weather forecast</li>
            </ul>

            {error && (
              <p className="text-[12px] text-white/40 mb-4">{error}</p>
            )}

            <button
              onClick={handleUnlock}
              disabled={isCheckingOut}
              className="text-[14px] tracking-[0.18em] uppercase text-white/80 hover:text-white disabled:opacity-40"
            >
              {isCheckingOut ? 'Redirecting...' : 'Unlock Blueprint'}
            </button>
          </div>
        </div>
        
        <BuildStamp />
      </div>
    );
  }

  // Unlocked readout
  return (
    <div className="min-h-screen bg-black text-white flex items-start pt-24">
      <div className="w-full max-w-[640px] mx-auto px-6 md:px-8 pb-32">
        {/* Header */}
        <div className="mb-20">
          <h1 className="font-display text-[38px] md:text-[46px] leading-[1.18] tracking-[-0.015em] font-normal">
            Your Manual
          </h1>
        </div>

        {/* Readout sections */}
        <div className="space-y-20">
          {readout?.insights?.map((insight, index) => (
            <div key={index}>
              <h2 className="font-display text-[24px] leading-[1.3] tracking-[-0.01em] font-normal mb-6 text-white">
                {insight.title}
              </h2>
              <p className="text-[15px] leading-[1.7] text-white/60">
                {insight.content}
              </p>
            </div>
          ))}
        </div>

        {/* Upgrade CTA - silent reference */}
        <div className="mt-32 pt-12 border-t border-white/10">
          <p className="text-[15px] leading-[1.7] text-white/45 mb-6">
            Add your people and access Crisis Mode
          </p>
          <button
            onClick={handleUpgradeOS}
            disabled={isCheckingOut}
            className="text-[14px] tracking-[0.18em] uppercase text-white/80 hover:text-white disabled:opacity-40"
          >
            {isCheckingOut ? 'Redirecting...' : 'Upgrade to OS'}
          </button>
        </div>
      </div>
      
      <BuildStamp />
    </div>
  );
}
