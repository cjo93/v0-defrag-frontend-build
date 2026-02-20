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
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation isAuthenticated={false} />
      
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 safe-top safe-bottom">
        <div className="w-full max-w-md">
          {/* Email Step */}
          {step === 'email' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-3xl font-bold">Sign in</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email to receive a magic link
                </p>
              </div>

              <form onSubmit={handleSendMagicLink} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-muted text-foreground"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <CTAButton type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Sending...' : 'Send magic link'}
                </CTAButton>
              </form>
            </div>
          )}

          {/* Verify Step */}
          {step === 'verify' && (
            <div className="flex flex-col gap-6 text-center">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Check your email</h1>
                <p className="text-sm text-muted-foreground">
                  We sent a magic link to <span className="text-foreground">{email}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Click the link to continue.
                </p>
              </div>

              <Button
                variant="ghost"
                onClick={() => setStep('email')}
                className="text-foreground hover:text-foreground/70"
              >
                Try a different email
              </Button>
            </div>
          )}

          {/* Context Step (Step 1 of onboarding) */}
          {step === 'context' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Step 1 of 2</h1>
                <p className="text-sm text-muted-foreground">
                  Set your location for accurate timing
                </p>
              </div>

              <form onSubmit={handleSaveContext} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="San Francisco"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="bg-muted text-foreground"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    type="text"
                    placeholder="America/Los_Angeles"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    required
                    className="bg-muted text-foreground"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <CTAButton type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Saving...' : 'Continue'}
                </CTAButton>
              </form>
            </div>
          )}

          {/* Baseline Step (Step 2 of onboarding) */}
          {step === 'baseline' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Step 2 of 2</h1>
                <p className="text-sm text-muted-foreground">
                  Set your baseline data
                </p>
              </div>

              <form onSubmit={handleSaveBaseline} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="bg-muted text-foreground"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="birthTime">Birth Time (optional)</Label>
                  <Input
                    id="birthTime"
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="bg-muted text-foreground"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="birthCity">Birth City</Label>
                  <Input
                    id="birthCity"
                    type="text"
                    placeholder="Los Angeles"
                    value={birthCity}
                    onChange={(e) => setBirthCity(e.target.value)}
                    required
                    className="bg-muted text-foreground"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <CTAButton type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Saving...' : 'Complete setup'}
                </CTAButton>
              </form>
            </div>
          )}
        </div>
      </main>
      
      <BuildStamp />
    </div>
  );
}
