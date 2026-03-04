"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getSession } from "@/lib/supabase";
import { Check } from "lucide-react";

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$9',
    period: '/month',
    description: 'Your personal insights',
    features: [
      'Your natal profile',
      'Daily pressure insights',
      'Relational chat assistant',
      'Timing recommendations',
    ],
    cta: 'Start with Basic',
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$19',
    period: '/month',
    description: 'Understand your relationships',
    features: [
      'Everything in Basic',
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
          <h1 className="text-3xl font-bold tracking-tight">DEFRAG</h1>
          <p className="text-gray-400">Choose your plan to continue</p>
          {canceled && (
            <p className="text-sm text-yellow-500">Checkout was canceled. Pick a plan when you're ready.</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border p-6 space-y-6 ${
                plan.highlighted 
                  ? 'border-white bg-[#0a0a0a]' 
                  : 'border-[#333] bg-[#111]'
              }`}
            >
              <div>
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-gray-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading !== null}
                className={`w-full rounded-none font-bold tracking-wider ${
                  plan.highlighted
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-[#222] text-white hover:bg-[#333] border border-[#444]'
                }`}
              >
                {loading === plan.id ? 'LOADING...' : plan.cta.toUpperCase()}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-600">
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
