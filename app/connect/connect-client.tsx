'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BuildStamp } from '@/components/build-stamp';
import { saveUserContext, saveBaseline } from '@/lib/api';
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

type Step = 'email' | 'context' | 'baseline';

export default function ConnectClient() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>('email');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [city, setCity] = useState('');
  const [timezone, setTimezone] = useState('');

  const [dob, setDob] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthCity, setBirthCity] = useState('');

  useEffect(() => {
    const urlStep = searchParams.get('step');
    if (urlStep && (urlStep === 'context' || urlStep === 'baseline')) {
      setStep(urlStep);
    }

    if (user && !urlStep) {
      setStep('context');
    }
  }, [searchParams, user]);

  const handleSaveContext = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await saveUserContext(city, timezone);
      setStep('baseline');
    } catch (_err) {
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
    } catch (_err) {
      setError('Failed to save your baseline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <EditorialRail variant="intake">
        {step === 'email' && (
          <>
            <H1>Sign in</H1>
            <Spacer size="m" />
            <Body>Password authentication is required.</Body>
            <Spacer size="l" />
            <div className="space-y-4">
              <Link href="/auth/login" className="inline-block">
                <TextActionButton>Go to login</TextActionButton>
              </Link>
              <div>
                <Link href="/auth/signup" className="text-white/70 text-sm underline underline-offset-4">
                  Need an account? Create one
                </Link>
              </div>
            </div>
          </>
        )}

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

        {step === 'baseline' && (
          <>
            <H1>Step 2 of 2</H1>
            <Spacer size="m" />
            <Body>Set your baseline data</Body>
            <Spacer size="l" />

            <form onSubmit={handleSaveBaseline}>
              <MicroLabel>DATE OF BIRTH</MicroLabel>
              <div className="mt-3">
                <LineInput id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
              </div>

              <Spacer size="m" />

              <MicroLabel>BIRTH TIME (OPTIONAL)</MicroLabel>
              <div className="mt-3">
                <LineInput id="birthTime" type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
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
