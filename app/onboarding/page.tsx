"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase, getSession } from "@/lib/supabase";

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [birthCity, setBirthCity] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 font-mono">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-[0.2em]">DEFRAG</h1>
          <p className="font-mono text-[12px] text-white/40 mt-2 tracking-widest">Tell us about yourself</p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-1 rounded-full ${s <= step ? 'bg-white' : 'bg-white/10'} transition-colors duration-200`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.02] p-6 border border-white/10 rounded-xl">
          
          {/* Step 1: Date of Birth */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold">When were you born?</h2>
                <p className="font-mono text-[11px] text-white/30 mt-1 tracking-wider">Step 1 of 3</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="bg-black border-white/10 rounded-lg focus-visible:ring-1 focus-visible:ring-white/30"
                />
              </div>
              <Button
                type="button"
                onClick={handleNext}
                className="w-full bg-white text-black hover:bg-white/90 rounded-lg font-mono text-[13px] font-bold tracking-widest"
              >
                CONTINUE
              </Button>
            </div>
          )}

          {/* Step 2: Time of Birth */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold">What time were you born?</h2>
                <p className="font-mono text-[11px] text-white/30 mt-1 tracking-wider">Step 2 of 3</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time of Birth</Label>
                <Input
                  id="time"
                  type="time"
                  value={unknownTime ? "12:00" : time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={unknownTime}
                  className="bg-black border-white/10 rounded-lg focus-visible:ring-1 focus-visible:ring-white/30 disabled:opacity-40"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="unknownTime"
                  checked={unknownTime}
                  onCheckedChange={(c) => setUnknownTime(c === true)}
                  className="rounded border-white/25 data-[state=checked]:bg-white data-[state=checked]:text-black"
                />
                <Label htmlFor="unknownTime" className="text-[13px] cursor-pointer text-white/70">
                  I don't know my birth time
                </Label>
              </div>
              {unknownTime && (
                <p className="text-[12px] text-white/30 mt-1 leading-relaxed">
                  We'll use 12:00 PM (noon). A noon chart still produces accurate results. <a href="https://support.defrag.app/birth-time" target="_blank" rel="noopener" className="underline hover:text-white/50 transition-colors">How to find your birth time</a>
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 border-white/10 text-white hover:bg-white/[0.04] hover:border-white/20 rounded-lg font-mono text-[13px] tracking-wider"
                >
                  BACK
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-white text-black hover:bg-white/90 rounded-lg font-mono text-[13px] font-bold tracking-widest"
                >
                  CONTINUE
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Birth City */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold">Where were you born?</h2>
                <p className="font-mono text-[11px] text-white/30 mt-1 tracking-wider">Step 3 of 3</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthCity">Birth City</Label>
                <Input
                  id="birthCity"
                  type="text"
                  placeholder="City, Country"
                  value={birthCity}
                  onChange={(e) => setBirthCity(e.target.value)}
                  required
                  className="bg-black border-white/10 rounded-lg focus-visible:ring-1 focus-visible:ring-white/30 placeholder:text-white/25"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 border-white/10 text-white hover:bg-white/[0.04] hover:border-white/20 rounded-lg font-mono text-[13px] tracking-wider"
                >
                  BACK
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-white text-black hover:bg-white/90 rounded-lg font-mono text-[13px] font-bold tracking-widest"
                  disabled={loading}
                >
                  {loading ? "SAVING..." : "COMPLETE"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
