"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase, getSession } from "@/lib/supabase";
import { Check } from "lucide-react";
import { ServiceUnavailable } from "@/components/service-unavailable";

const plans = [
  {
    id: 'solo',
    name: 'Solo',
    price: '$19',
    period: '/month',
    description: 'Your personal insights',
    features: [
      'Personal chart',
      'AI relationship questions',
      'Daily insights',
      'Timing recommendations',
    ],
    cta: 'Start with Solo',
  },
  {
    id: 'team',
    name: 'Team',
    price: '$33',
    period: '/month',
    description: 'Understand your relationships',
    features: [
      'Everything in Solo',
      'Add family & team members',
      'Relationship overlays',
      'Group dynamics insights',
    ],
    cta: 'Upgrade to Team',
    highlighted: true,
  },
];

function UnlockContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  if (!supabase) return <ServiceUnavailable />;

  const canceled = searchParams.get('canceled');

  const handleCheckout = async (planId: string) => {
    setLoading(planId);

    try {
      const session = await getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planId,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Checkout failed');
      }

      const { url } = await res.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans antialiased flex flex-col items-center justify-center p-6">
      <div className="mx-auto w-full max-w-[1100px] px-6 md:px-8 space-y-10">
        <div className="text-center space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Select a plan</p>
          <h1 className="text-[26px] md:text-[34px] font-normal tracking-[-0.015em]">Choose your plan to continue</h1>
          {canceled && (
            <p className="text-[14px] text-yellow-500/70">Checkout was canceled. Pick a plan when you&apos;re ready.</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border p-6 md:p-8 space-y-6 transition-all duration-200 ease-out rounded-sm ${
                plan.highlighted 
                  ? 'border-white/20 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]' 
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div>
                <h2 className="text-[22px] md:text-[24px] font-normal tracking-[-0.015em]">{plan.name}</h2>
                <p className="font-mono text-[11px] text-white/50 mt-1 uppercase tracking-[0.2em]">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-[34px] md:text-[38px] font-normal tracking-[-0.02em]">{plan.price}</span>
                <span className="text-white/45 text-[14px]">{plan.period}</span>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-[14px] text-white/65">
                    <Check className="w-4 h-4 text-white/35 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading !== null}
                className={`w-full h-12 rounded-sm font-mono text-[13px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 ease-out active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${
                  plan.highlighted
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'border border-white/10 text-white/80 hover:text-white hover:border-white/20'
                }`}
              >
                {loading === plan.id ? 'Loading...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center font-mono text-[11px] text-white/30 tracking-[0.2em] uppercase">
          Cancel anytime · No commitment required
        </p>
      </div>
    </div>
  );
}

export default function UnlockPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <UnlockContent />
    </Suspense>
  );
}
