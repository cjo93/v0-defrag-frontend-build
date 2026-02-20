'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { BuildStamp } from '@/components/build-stamp';
import { CTAButton } from '@/components/cta-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveUserContext, saveBaseline } from '@/lib/api';
import { sendMagicLink } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

type Step = 'email' | 'verify' | 'context' | 'baseline';

export default function ConnectClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Context form state
  const [city, setCity] = useState('');
  const [timezone, setTimezone] = useState('');

  // Baseline form state
  const [dob, setDob] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthCity, setBirthCity] = useState('');

  // Handle URL step parameter and auth state
  useEffect(() => {
    const urlStep = searchParams.get('step');
    if (urlStep && (urlStep === 'context' || urlStep === 'baseline')) {
      setStep(urlStep);
    }
    
    // If user is authenticated and no step specified, go to context
    if (user && !urlStep) {
      setStep('context');
    }
  }, [searchParams, user]);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await sendMagicLink(email);
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContext = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await saveUserContext(city, timezone);
      setStep('baseline');
    } catch (err) {
      setError('Failed to save your location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBaseline = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await saveBaseline(dob, birthTime || null, birthCity);
      // Redirect to self readout
      window.location.href = '/readout/self';
    } catch (err) {
      setError('Failed to save your baseline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center">
      <div className="w-full max-w-[560px] mx-auto px-6 md:px-8">
        {/* Email Step */}
        {step === 'email' && (
          <div className="space-y-12">
            <div>
              <h1 className="font-display text-[42px] md:text-[52px] leading-[1.15] tracking-[-0.02em] font-normal mb-7">
                Sign in
              </h1>
              <p className="text-[15px] text-white/55 leading-[1.7] max-w-[420px]">
                We'll send a secure link. No password.
              </p>
            </div>

            <form onSubmit={handleSendMagicLink} className="space-y-8">
              <div>
                <label htmlFor="email" className="micro-label block mb-2">
                  EMAIL
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-white/18 pb-3.5 text-base tracking-[0.02em] transition-colors duration-180 focus:border-white/45 focus:outline-none placeholder:text-white/25"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="h-12 px-7 border border-white/30 bg-transparent text-sm tracking-wide transition-colors duration-180 hover:border-white/60 disabled:opacity-40"
              >
                {isLoading ? 'Sending...' : 'Begin'}
              </button>
            </form>
          </div>
        )}

        {/* Verify Step */}
        {step === 'verify' && (
          <div className="space-y-12">
            <div>
              <h1 className="font-display text-[42px] md:text-[52px] leading-[1.15] tracking-[-0.02em] font-normal mb-7">
                Check your email
              </h1>
              <p className="text-[15px] text-white/55 leading-[1.7] max-w-[420px]">
                We sent a magic link to <span className="text-white">{email}</span>
              </p>
              <p className="mt-4 text-[15px] text-white/55 leading-[1.7]">
                Click the link to continue.
              </p>
            </div>

            <button
              onClick={() => setStep('email')}
              className="text-sm text-white/40 transition-colors duration-180 hover:text-white/60"
            >
              Try a different email
            </button>
          </div>
        )}

        {/* Context Step (Step 1 of onboarding) */}
        {step === 'context' && (
          <div className="space-y-12">
            <div>
              <h1 className="font-display text-[42px] md:text-[52px] leading-[1.15] tracking-[-0.02em] font-normal mb-7">
                Step 1 of 2
              </h1>
              <p className="text-[15px] text-white/55 leading-[1.7] max-w-[420px]">
                Set your location for accurate timing
              </p>
            </div>

            <form onSubmit={handleSaveContext} className="space-y-8">
              <div>
                <label htmlFor="city" className="micro-label block mb-2">
                  CITY
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="San Francisco"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-white/18 pb-3.5 text-base tracking-[0.02em] transition-colors duration-180 focus:border-white/45 focus:outline-none placeholder:text-white/25"
                />
              </div>

              <div>
                <label htmlFor="timezone" className="micro-label block mb-2">
                  TIMEZONE
                </label>
                <input
                  id="timezone"
                  type="text"
                  placeholder="America/Los_Angeles"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-white/18 pb-3.5 text-base tracking-[0.02em] transition-colors duration-180 focus:border-white/45 focus:outline-none placeholder:text-white/25"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="h-12 px-7 border border-white/30 bg-transparent text-sm tracking-wide transition-colors duration-180 hover:border-white/60 disabled:opacity-40"
              >
                {isLoading ? 'Saving...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Baseline Step (Step 2 of onboarding) */}
        {step === 'baseline' && (
          <div className="space-y-12">
            <div>
              <h1 className="font-display text-[42px] md:text-[52px] leading-[1.15] tracking-[-0.02em] font-normal mb-7">
                Step 2 of 2
              </h1>
              <p className="text-[15px] text-white/55 leading-[1.7] max-w-[420px]">
                Set your baseline data
              </p>
            </div>

            <form onSubmit={handleSaveBaseline} className="space-y-8">
              <div>
                <label htmlFor="dob" className="micro-label block mb-2">
                  DATE OF BIRTH
                </label>
                <input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-white/18 pb-3.5 text-base tracking-[0.02em] transition-colors duration-180 focus:border-white/45 focus:outline-none placeholder:text-white/25"
                />
              </div>

              <div>
                <label htmlFor="birthTime" className="micro-label block mb-2">
                  BIRTH TIME (OPTIONAL)
                </label>
                <input
                  id="birthTime"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full bg-transparent border-b border-white/18 pb-3.5 text-base tracking-[0.02em] transition-colors duration-180 focus:border-white/45 focus:outline-none placeholder:text-white/25"
                />
              </div>

              <div>
                <label htmlFor="birthCity" className="micro-label block mb-2">
                  BIRTH CITY
                </label>
                <input
                  id="birthCity"
                  type="text"
                  placeholder="Los Angeles"
                  value={birthCity}
                  onChange={(e) => setBirthCity(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-white/18 pb-3.5 text-base tracking-[0.02em] transition-colors duration-180 focus:border-white/45 focus:outline-none placeholder:text-white/25"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="h-12 px-7 border border-white/30 bg-transparent text-sm tracking-wide transition-colors duration-180 hover:border-white/60 disabled:opacity-40"
              >
                {isLoading ? 'Saving...' : 'Complete setup'}
              </button>
            </form>
          </div>
        )}
      </div>
      
      <BuildStamp />
    </div>
  );
}
