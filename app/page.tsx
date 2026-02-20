'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { BuildStamp } from '@/components/build-stamp';
import { CTAButton } from '@/components/cta-button';
import { Button } from '@/components/ui/button';
import { IntroAnimation } from '@/components/intro-animation';
import { RotatingText } from '@/components/rotating-text';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    // Check if user has seen intro before
    const seen = localStorage.getItem('defrag-intro-seen');
    if (seen) {
      setShowIntro(false);
      setHasSeenIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem('defrag-intro-seen', 'true');
    setShowIntro(false);
    setHasSeenIntro(true);
  };

  if (showIntro && !hasSeenIntro) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation isAuthenticated={false} />
      
      <main className="flex flex-1 flex-col justify-center px-8 py-16 safe-top safe-bottom">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-start text-left">
          {/* Headline */}
          <h1 className="mt-24 max-w-[18ch] text-[42px] font-[300] leading-[1.05] tracking-tight text-white">
            The user manual for you, and your people.
          </h1>
          
          {/* Subhead - static, subtle */}
          <p className="mt-6 text-base text-white/50">
            For your parent. Your partner. Your legacy.
          </p>
          
          {/* CTA - proper surface button */}
          <Link href="/connect">
            <button className="mt-10 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-medium tracking-wide text-white transition hover:border-white/30 hover:bg-white/[0.06]">
              Begin
            </button>
          </Link>
          
          {/* Sign in - subtle link */}
          <Link href="/connect" className="mt-4 text-sm text-white/40 transition hover:text-white/60">
            Sign in
          </Link>
        </div>
      </main>
      
      <BuildStamp />
    </div>
  );
}
