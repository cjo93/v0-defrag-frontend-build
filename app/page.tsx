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
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation isAuthenticated={false} />
      
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 safe-top safe-bottom">
        <div className="flex max-w-2xl flex-col items-center gap-8 text-center">
          {/* Headline */}
          <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            The user manual for you, and your people.
          </h1>
          
          {/* Rotating subhead */}
          <RotatingText />
          
          {/* CTAs */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link href="/connect">
              <CTAButton size="lg" className="min-w-[140px]">
                Begin
              </CTAButton>
            </Link>
            <Link href="/connect">
              <Button 
                variant="ghost" 
                size="lg"
                className="min-w-[140px] text-foreground hover:text-foreground/70"
              >
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <BuildStamp />
    </div>
  );
}
