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
      
      <main className="flex flex-1 flex-col justify-center px-6 py-16 safe-top safe-bottom md:px-10">
        <div className="editorial-rail">
          {/* Headline - Playfair display */}
          <h1 className="font-display text-[48px] font-[400] leading-[1.05] tracking-tight text-white md:text-[72px]">
            The user manual for you, and your people.
          </h1>
          
          {/* Subhead - static, minimal */}
          <p className="mt-6 text-[15px] leading-relaxed text-white/40 md:text-[17px]">
            Your parent. Your partner. Your legacy.
          </p>
          
          {/* CTA */}
          <Link href="/connect" className="mt-12 inline-block">
            <button className="defrag-accent-ring rounded-lg border border-white/10 bg-white/[0.02] px-7 py-4 text-sm font-medium tracking-wide text-white transition-all duration-200">
              Begin
            </button>
          </Link>
          
          {/* Sign in - subtle link */}
          <Link href="/connect" className="mt-5 block text-sm text-white/30 transition-colors duration-200 hover:text-white/50">
            Sign in
          </Link>
        </div>
      </main>
      
      <BuildStamp />
    </div>
  );
}
