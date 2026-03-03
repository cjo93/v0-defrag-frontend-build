/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BuildStamp } from '@/components/build-stamp';
import { saveUserContext, saveBaseline } from '@/lib/api';
import { sendMagicLink } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import {
  AppShell,
  EditorialRail,
  H1,
  Body,
  MicroLabel,
  Spacer,
  LineInput,
  TextActionButton,
  Hint,
} from '@/components/editorial';

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
      window.location.href = '/readout/self';
    } catch (err) {
      setError('Failed to save your baseline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <EditorialRail variant="intake">
        {/* Email Step */}
        {step === 'email' && (
          <>
            <H1>Sign in</H1>
            <Spacer size="m" />
            <Body>We'll send a secure link. No password.</Body>
            <Spacer size="l" />

            <form onSubmit={handleSendMagicLink}>
              <MicroLabel>EMAIL</MicroLabel>
              <div className="mt-3">
                <LineInput
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <>
                  <Spacer size="s" />
                  <Hint>{error}</Hint>
                </>
              )}

              <Spacer size="l" />
              <TextActionButton type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Begin'}
              </TextActionButton>
            </form>
          </>
        )}

        {/* Verify Step */}
        {step === 'verify' && (
          <>
            <H1>Check your email</H1>
            <Spacer size="m" />
            <Body>
              We sent a magic link to <span className="text-white">{email}</span>
            </Body>
            <div className="mt-4">
              <Body>Click the link to continue.</Body>
            </div>

            <Spacer size="l" />
            <TextActionButton onClick={() => setStep('email')}>
              Try a different email
            </TextActionButton>
          </>
        )}

        {/* Context Step (Step 1 of onboarding) */}
        {step === 'context' && (
          <>
            <H1>Step 1 of 2</H1>
            <Spacer size="m" />
            <Body>Set your location for accurate timing</Body>
            <Spacer size="l" />

            <form onSubmit={handleSaveContext}>
              <MicroLabel>CITY</MicroLabel>
              <div className="mt-3">
                <LineInput
                  id="city"
                  type="text"
                  placeholder="San Francisco"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <Spacer size="m" />

              <MicroLabel>TIMEZONE</MicroLabel>
              <div className="mt-3">
                <LineInput
                  id="timezone"
                  type="text"
                  placeholder="America/Los_Angeles"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  required
                />
              </div>

              {error && (
                <>
                  <Spacer size="s" />
                  <Hint>{error}</Hint>
                </>
              )}

              <Spacer size="l" />
              <TextActionButton type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Continue'}
              </TextActionButton>
            </form>
          </>
        )}

        {/* Baseline Step (Step 2 of onboarding) */}
        {step === 'baseline' && (
          <>
            <H1>Step 2 of 2</H1>
            <Spacer size="m" />
            <Body>Set your baseline data</Body>
            <Spacer size="l" />

            <form onSubmit={handleSaveBaseline}>
              <MicroLabel>DATE OF BIRTH</MicroLabel>
              <div className="mt-3">
                <LineInput
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>

              <Spacer size="m" />

              <MicroLabel>BIRTH TIME (OPTIONAL)</MicroLabel>
              <div className="mt-3">
                <LineInput
                  id="birthTime"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                />
              </div>

              <Spacer size="m" />

              <MicroLabel>BIRTH CITY</MicroLabel>
              <div className="mt-3">
                <LineInput
                  id="birthCity"
                  type="text"
                  placeholder="Los Angeles"
                  value={birthCity}
                  onChange={(e) => setBirthCity(e.target.value)}
                  required
                />
              </div>

              {error && (
                <>
                  <Spacer size="s" />
                  <Hint>{error}</Hint>
                </>
              )}

              <Spacer size="l" />
              <TextActionButton type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Complete setup'}
              </TextActionButton>
            </form>
          </>
        )}
      </EditorialRail>
      <BuildStamp />
    </AppShell>
  );
}
