"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getSession } from "@/lib/supabase";

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const session = await getSession();
      if (!session) throw new Error("Unauthorized");

      // Direct write to Supabase birthlines per instructions
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          }
        }
      );

      const finalTime = unknownTime ? "12:00:00" : (time.includes(':') && time.length === 5 ? time + ':00' : time);

      const payload = {
        user_id: session.user.id,
        dob,
        birth_time: unknownTime ? null : finalTime,
        birth_city: location
      };

      const { error } = await supabase.from('birthlines').insert(payload);

      if (error) {
        console.error('Insert error:', error);
        throw new Error("Failed to save birthline data.");
      }

      toast({
        title: "Profile created",
        description: "Your baseline has been saved successfully.",
      });

      router.push("/dashboard");
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
          <h1 className="text-2xl font-bold tracking-tight">Onboarding</h1>
          <p className="text-gray-400 mt-2 text-sm">Enter your baseline coordinates.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#111] p-6 border border-[#333]">
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="bg-black border-[#333] rounded-none focus-visible:ring-1 focus-visible:ring-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time of Birth</Label>
            <Input
              id="time"
              type="time"
              value={unknownTime ? "12:00" : time}
              onChange={(e) => setTime(e.target.value)}
              disabled={unknownTime}
              required={!unknownTime}
              className="bg-black border-[#333] rounded-none focus-visible:ring-1 focus-visible:ring-white disabled:opacity-50"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="unknownTime"
              checked={unknownTime}
              onCheckedChange={(c) => setUnknownTime(c === true)}
              className="rounded-none border-gray-500 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <Label htmlFor="unknownTime" className="text-sm cursor-pointer">
              I don't know my birth time
            </Label>
          </div>
          {unknownTime && (
            <p className="text-xs text-gray-500 mt-1">
              Defaulting to 12:00 PM (Noon Chart). A noon chart still produces accurate planetary relationships. <a href="#" className="underline">How to find your birth time</a>
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="location">Birth Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="City, State, Country"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="bg-black border-[#333] rounded-none focus-visible:ring-1 focus-visible:ring-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-gray-200 rounded-none font-bold tracking-wider"
            disabled={loading}
          >
            {loading ? "GENERATING..." : "GENERATE CHART"}
          </Button>
        </form>
      </div>
    </div>
  );
}
