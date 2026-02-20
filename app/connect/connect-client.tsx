'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BuildStamp } from '@/components/build-stamp';
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
    <div className="min-h-screen bg-black text-white flex items-start pt-32">
      <div className="w-full max-w-[520px] mx-auto px-6 md:px-8">
        {/* Email Step */}
        {step === 'email' && (
          <div>
            <div className="text-left">
              <h1 className="font-display text-[38px] md:text-[46px] leading-[1.18] tracking-[-0.015em] font-normal mb-7">
                Sign in
              </h1>
              <p className="text-[15px] text-white/45 leading-[1.7] max-w-[420px]">
                We'll send a secure link. No password.
              </p>
            </div>

            <form onSubmit={handleSendMagicLink} className="mt-20">
              <div>
                <label htmlFor="email" className="block text-[10px] tracking-[0.35em] text-white/35 uppercase mb-3">
                  EMAIL
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-white/20 py-5 text-[16px] tracking-[0.02em] focus:border-white/60 focus:outline-none transition-none placeholder:text-white/25"
                />
              </div>

              {error && (
                <p className="text-[12px] text-white/40 mt-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-16 text-[14px] tracking-[0.18em] uppercase text-white/80 hover:text-white disabled:opacity-40"
              >
                {isLoading ? 'Sending...' : 'Begin'}
              </button>
            </form>
          </div>
        )}

        {/* Verify Step */}
        {step === 'verify' && (
          <div>
            <div className="text-left">
              <h1 className="font-display text-[38px] md:text-[46px] leading-[1.18] tracking-[-0.015em] font-normal mb-7">
                Check your email
              </h1>
              <p className="text-[15px] text-white/45 leading-[1.7] max-w-[420px]">
                We sent a magic link to <span className="text-white">{email}</span>
              </p>
              <p className="mt-4 text-[15px] text-white/45 leading-[1.7]">
                Click the link to continue.
              </p>
            </div>

            <button
              onClick={() => setStep('email')}
              className="mt-20 text-[14px] tracking-[0.18em] uppercase text-white/80 hover:text-white"
            >
              Try a different email
            </button>
          </div>
        )}

        {/* Context Step (Step 1 of onboarding) */}
        {step === 'context' && (
          <div>
            <div className="text-left">
              <h1 className="font-display text-[38px] md:text-[46px] leading-[1.18] tracking-[-0.015em] font-normal mb-7">
                Step 1 of 2
              </h1>
              <p className="text-[15px] text-white/45 leading-[1.7] max-w-[420px]">
                Set your location for accurate timing
              </p>
            </div>

            <form onSubmit={handleSaveContext} className="mt-20">
              <div>
                <label htmlFor="city" className="block text-[10px] tracking-[0.35em] text-white/35 uppercase mb-3">
                  CITY
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="San Francisco"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-white/20 py-5 text-[16px] tracking-[0.02em] focus:border-white/60 focus:outline-none transition-none placeholder:text-white/25"
                />
              </div>

              <div className="mt-14">
                <label htmlFor="timezone" className="block text-[10px] tracking-[0.35em] text-white/35 uppercase mb-3">
                  TIMEZONE
                </label>
                <input
                  id="timezone"
                  type="text"
                  placeholder="America/Los_Angeles"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-white/20 py-5 text-[16px] tracking-[0.02em] focus:border-white/60 focus:outline-none transition-none placeholder:text-white/25"
                />
              </div>

              {error && (
                <p className="text-[12px] text-white/40 mt-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-16 text-[14px] tracking-[0.18em] uppercase text-white/80 hover:text-white disabled:opacity-40"
              >
                {isLoading ? 'Saving...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Baseline Step (Step 2 of onboarding) */}
        {step === 'baseline' && (
          <div>
            <div className="text-left">
              <h1 className="font-display text-[38px] md:text-[46px] leading-[1.18] tracking-[-0.015em] font-normal mb-7">
                Step 2 of 2
              </h1>
              <p className="text-[15px] text-white/45 leading-[1.7] max-w-[420px]">
                Set your baseline data
              </p>
            </div>

            <form onSubmit={handleSaveBaseline} className="mt-20">
              <div>
                <label htmlFor="dob" className="block text-[10px] tracking-[0.35em] text-white/35 uppercase mb-3">
                  DATE OF BIRTH
                </label>
                <input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-white/20 py-5 text-[16px] tracking-[0.02em] focus:border-white/60 focus:outline-none transition-none placeholder:text-white/25"
                />
              </div>

              <div className="mt-14">
                <label htmlFor="birthTime" className="block text-[10px] tracking-[0.35em] text-white/35 uppercase mb-3">
                  BIRTH TIME (OPTIONAL)
                </label>
                <input
                  id="birthTime"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 py-5 text-[16px] tracking-[0.02em] focus:border-white/60 focus:outline-none transition-none placeholder:text-white/25"
                />
              </div>

              <div className="mt-14">
                <label htmlFor="birthCity" className="block text-[10px] tracking-[0.35em] text-white/35 uppercase mb-3">
                  BIRTH CITY
                </label>
                <input
                  id="birthCity"
                  type="text"
                  placeholder="Los Angeles"
                  value={birthCity}
                  onChange={(e) => setBirthCity(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-white/20 py-5 text-[16px] tracking-[0.02em] focus:border-white/60 focus:outline-none transition-none placeholder:text-white/25"
                />
              </div>

              {error && (
                <p className="text-[12px] text-white/40 mt-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-16 text-[14px] tracking-[0.18em] uppercase text-white/80 hover:text-white disabled:opacity-40"
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
