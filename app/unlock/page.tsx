"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getSession } from "@/lib/supabase";
import { Check } from "lucide-react";

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
    id: 'plus',
    name: 'Plus',
    price: '$33',
    period: '/month',
    description: 'Understand your relationships',
    features: [
      'Everything in Solo',
      'Add family & team members',
      'Relationship overlays',
      'Group dynamics insights',
      'Daily audio briefings',
    ],
    cta: 'Upgrade to Plus',
    highlighted: true,
  },
];

function UnlockContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

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
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-[32px] font-light tracking-[-0.02em]">DEFRAG</h1>
          <p className="font-mono text-[12px] text-white/40 tracking-widest">Choose your plan to continue</p>
          {canceled && (
            <p className="text-[13px] text-yellow-500/80">Checkout was canceled. Pick a plan when you're ready.</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border p-6 space-y-6 transition-colors duration-200 rounded-xl ${
                plan.highlighted 
                  ? 'border-white/25 bg-white/[0.03] hover:border-white/40' 
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20'
              }`}
            >
              <div>
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="font-mono text-[12px] text-white/40 mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-white/30">{plan.period}</span>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-[14px] text-white/70">
                    <Check className="w-4 h-4 text-white/30" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading !== null}
                className={`w-full rounded-lg font-mono text-[13px] font-bold tracking-widest ${
                  plan.highlighted
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'bg-white/[0.02] text-white hover:bg-white/[0.06] border border-white/10 hover:border-white/20'
                } transition-all duration-200 disabled:opacity-40`}
              >
                {loading === plan.id ? 'LOADING...' : plan.cta.toUpperCase()}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-white/20 font-mono tracking-wider">
          Cancel anytime. No commitment required.
        </p>
      </div>
    </div>
  );
}

export default function UnlockPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <UnlockContent />
    </Suspense>
  );
}
