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
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex flex-1 flex-col justify-center px-6 py-16 safe-top safe-bottom md:px-10">
        <div className="max-w-[640px] mx-auto">
          {/* Headline - locked typography */}
          <h1 className="font-display text-[38px] md:text-[56px] leading-[1.18] tracking-[-0.01em] font-medium text-white">
            The user manual for you, and your people.
          </h1>
          
          {/* Subhead - static, restrained */}
          <p className="mt-8 text-[16px] leading-[1.75] text-white/45 max-w-[480px]">
            Your parent. Your partner. Your legacy.
          </p>
          
          {/* CTA - statement not button */}
          <Link href="/connect" className="mt-16 inline-block">
            <span className="text-[14px] tracking-[0.18em] uppercase text-white/80 hover:text-white">
              Begin
            </span>
          </Link>
          
          {/* Sign in - subtle reference */}
          <Link href="/connect" className="mt-6 block text-[14px] text-white/30 hover:text-white/50">
            Sign in
          </Link>
        </div>
      </main>
      
      <BuildStamp />
    </div>
  );
}
