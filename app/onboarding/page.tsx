"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase, getSession } from "@/lib/supabase";
import { ServiceUnavailable } from "@/components/service-unavailable";

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [birthCity, setBirthCity] = useState("");
  const [loading, setLoading] = useState(false);

  if (!supabase) return <ServiceUnavailable />;

  const handleNext = () => {
    if (step === 1 && !dob) {
      toast({ title: "Required", description: "Please enter your date of birth.", variant: "destructive" });
      return;
    }
    if (step === 2 && !unknownTime && !time) {
      toast({ title: "Required", description: "Please enter your birth time or select 'I don't know'.", variant: "destructive" });
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!birthCity) {
      toast({ title: "Required", description: "Please enter your birth city.", variant: "destructive" });
      return;
    }
    
    setLoading(true);

    try {
      if (!supabase) throw new Error("Auth not configured");
      
      const session = await getSession();
      if (!session) throw new Error("Please log in to continue");

      // Write to birthlines table
      const birthTime = unknownTime ? "12:00:00" : `${time}:00`;
      
      const { error } = await supabase
        .from('birthlines')
        .upsert({
          user_id: session.user.id,
          dob: dob,
          birth_time: birthTime,
          birth_city: birthCity,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Profile saved",
        description: "Your information has been saved.",
      });

      // Route to unlock (or dashboard if already unlocked)
      router.push("/unlock");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-sans antialiased p-6">
      <div className="mx-auto w-full max-w-[440px] space-y-8">
        <div className="text-center">
          <p className="font-mono text-[13px] font-semibold tracking-[0.2em] text-white mb-3">DEFRAG</p>
          <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Tell us about yourself</p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-[2px] rounded-full ${s <= step ? 'bg-white' : 'bg-white/[0.08]'} transition-colors duration-200`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-xl animate-fade-in">
          
          {/* Step 1: Date of Birth */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-[20px] md:text-[22px] font-normal tracking-[-0.015em] text-white">When were you born?</h2>
                <p className="font-mono text-[11px] text-white/45 mt-2 tracking-[0.2em] uppercase">Step 1 of 3</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="bg-black border-white/[0.08] rounded-xl focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/30 h-[48px] px-5 text-[15px]"
                />
                <p className="font-mono text-[11px] text-white/35 tracking-[0.1em]">Used to establish your baseline.</p>
              </div>
              <Button
                type="button"
                onClick={handleNext}
                className="w-full h-[52px] bg-white text-black hover:bg-white/90 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] active:scale-[0.98] rounded-xl font-mono text-[13px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 ease-out"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Time of Birth */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-[20px] md:text-[22px] font-normal tracking-[-0.015em] text-white">What time were you born?</h2>
                <p className="font-mono text-[11px] text-white/45 mt-2 tracking-[0.2em] uppercase">Step 2 of 3</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Time of Birth</Label>
                <Input
                  id="time"
                  type="time"
                  value={unknownTime ? "12:00" : time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={unknownTime}
                  className="bg-black border-white/[0.08] rounded-xl focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/30 disabled:opacity-40 h-[48px] px-5 text-[15px]"
                />
                <p className="font-mono text-[11px] text-white/35 tracking-[0.1em]">Optional. If unknown, the system estimates using noon.</p>
              </div>
              <div className="flex items-center space-x-2.5">
                <Checkbox
                  id="unknownTime"
                  checked={unknownTime}
                  onCheckedChange={(c) => setUnknownTime(c === true)}
                  className="rounded border-white/25 data-[state=checked]:bg-white data-[state=checked]:text-black"
                />
                <Label htmlFor="unknownTime" className="text-[14px] cursor-pointer text-white/65">
                  I don&apos;t know my birth time
                </Label>
              </div>
              {unknownTime && (
                <p className="text-[13px] text-white/45 mt-1 leading-relaxed">
                  We&apos;ll use 12:00 PM (noon). A noon chart still produces accurate results. <a href="https://support.defrag.app/birth-time" target="_blank" rel="noopener" className="underline hover:text-white/60 transition-colors">How to find your birth time</a>
                </p>
              )}
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 h-[52px] border-white/25 text-white/80 hover:bg-white/[0.04] hover:border-white/50 active:scale-[0.98] rounded-xl font-mono text-[13px] tracking-[0.08em] uppercase transition-all duration-200 ease-out"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 h-[52px] bg-white text-black hover:bg-white/90 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] active:scale-[0.98] rounded-xl font-mono text-[13px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 ease-out"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Birth City */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-[20px] md:text-[22px] font-normal tracking-[-0.015em] text-white">Where were you born?</h2>
                <p className="font-mono text-[11px] text-white/45 mt-2 tracking-[0.2em] uppercase">Step 3 of 3</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthCity" className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Birth City</Label>
                <Input
                  id="birthCity"
                  type="text"
                  placeholder="City, Country"
                  value={birthCity}
                  onChange={(e) => setBirthCity(e.target.value)}
                  required
                  className="bg-black border-white/[0.08] rounded-xl focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/30 placeholder:text-white/30 h-[48px] px-5 text-[15px]"
                />
                <p className="font-mono text-[11px] text-white/35 tracking-[0.1em]">Provides geographic context for timing patterns.</p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 h-[52px] border-white/25 text-white/80 hover:bg-white/[0.04] hover:border-white/50 active:scale-[0.98] rounded-xl font-mono text-[13px] tracking-[0.08em] uppercase transition-all duration-200 ease-out"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-[52px] bg-white text-black hover:bg-white/90 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] active:scale-[0.98] rounded-xl font-mono text-[13px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 ease-out"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Complete"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
