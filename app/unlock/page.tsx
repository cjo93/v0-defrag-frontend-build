"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase, getSession } from "@/lib/supabase";
import { Check } from "lucide-react";
import { ServiceUnavailable } from "@/components/service-unavailable";

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'See what DEFRAG can do',
    features: [
      'Personal natal chart',
      'Limited relationship chat',
      'Basic daily insight',
    ],
    cta: 'Continue free',
  },
  {
    id: 'solo',
    name: 'Solo',
    price: '$19',
    period: '/month',
    description: 'Personal intelligence unlocked',
    features: [
      'Unlimited relationship chat',
      'Full daily briefings',
      'Saved conversation history',
      'Timing recommendations',
    ],
    cta: 'Start Solo - $19/mo',
  },
  {
    id: 'team',
    name: 'Team',
    price: '$33',
    period: '/month',
    description: 'For families and close groups',
    features: [
      'Everything in Solo',
      'Add people + invite links',
      'Full relationship map',
      'Group dynamics + deeper context',
    ],
    cta: 'Start Team - $33/mo',
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
    // Free tier — skip checkout, go straight to dashboard
    if (planId === 'free') {
      try {
        const session = await getSession();
        if (!session) { router.push('/auth/login'); return; }
        if (supabase) {
          await supabase.from('profiles').upsert({
            user_id: session.user.id,
            plan: 'free',
          }, { onConflict: 'user_id' });
        }
        router.push('/dashboard');
      } catch {
        router.push('/dashboard');
      }
      return;
    }

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
    <div className="min-h-screen bg-[#09090b] text-white font-sans antialiased flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(255,255,255,0.04), transparent 70%)' }}
      />

      <div className="relative mx-auto w-full max-w-[1100px] px-6 md:px-8 space-y-10">
        <div className="text-center space-y-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/35 font-medium">Choose your plan</p>
          <h1 className="text-[28px] md:text-[36px] font-bold tracking-[-0.025em]">Choose how you want to use DEFRAG</h1>
          <p className="text-[15px] text-white/35 max-w-xl mx-auto">Start free. Upgrade to Solo for full personal insight, or Team for shared relationship intelligence.</p>
          {canceled && (
            <p className="text-[14px] text-white/50 mt-2">Checkout was canceled. Pick a plan when you&apos;re ready.</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border p-6 md:p-8 space-y-6 transition-all duration-300 ease-out rounded-2xl ${
                plan.highlighted 
                  ? 'border-white/[0.12] bg-white/[0.04] hover:border-white/[0.18] hover:bg-white/[0.06] shadow-[0_0_60px_rgba(255,255,255,0.02)]' 
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.10] hover:bg-white/[0.035]'
              }`}
            >
              {plan.highlighted && (
                <div className="flex justify-end -mt-2 -mr-2">
                  <span className="inline-block text-[9px] uppercase tracking-[0.15em] px-3 py-1 rounded-full font-bold text-black bg-white shadow-[0_0_16px_rgba(255,255,255,0.15)]">
                    Best value
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-[20px] font-semibold text-white/90">{plan.name}</h2>
                <p className="text-[13px] text-white/35 mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-[36px] font-bold text-white tracking-tight">{plan.price}</span>
                <span className="text-white/25 text-[14px]">{plan.period}</span>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              <ul className="space-y-3.5">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-[14px] text-white/50">
                    <Check className="w-4 h-4 text-white/25 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading !== null}
                className={`w-full h-12 rounded-xl text-[13px] font-bold uppercase tracking-[0.08em] transition-all duration-200 ease-out active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${
                  plan.highlighted
                    ? 'bg-white text-[#09090b] hover:bg-white/90 shadow-[0_0_24px_rgba(255,255,255,0.08)]'
                    : 'border border-white/[0.08] text-white/55 hover:text-white hover:border-white/15 hover:bg-white/[0.04]'
                }`}
              >
                {loading === plan.id ? 'Loading...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-[12px] text-white/20 tracking-[0.1em]">
          Free tier requires no card. Paid plans activate after successful checkout and can be canceled anytime.
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
