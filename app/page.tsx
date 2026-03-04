'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { RelationshipMapPreview } from '@/components/landing/relationship-map-preview';
import { DashboardPreview } from '@/components/landing/dashboard-preview';
import { ChatPreview } from '@/components/landing/chat-preview';

/* ─── helpers ─── */
const scrollTo = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  return (
    <main className="min-h-screen bg-black text-white font-sans antialiased">

      {/* ════════ HERO ════════ */}
      <section className="mx-auto max-w-[920px] px-6 md:px-8 mt-24 mb-24 flex flex-col justify-center min-h-[80vh]">
        <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-8">
          DEFRAG
        </p>
        <h1 className="text-[36px] md:text-[56px] font-normal tracking-[-0.025em] leading-[1.08] text-white mb-6">
          Clarity for hard<br className="hidden md:block" /> relationships.
        </h1>
        <p className="text-[17px] md:text-[20px] text-white/70 leading-[1.6] max-w-[540px] mb-12">
          Understand what&apos;s driving tension — and choose your next move with better timing.
        </p>

        <div className="flex gap-4 flex-wrap mb-14">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center h-[52px] px-9 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:bg-white/90 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] active:scale-[0.98] transition-all duration-200 ease-out"
          >
            Create account
          </Link>
          <a
            href="#how-it-helps"
            onClick={scrollTo('how-it-helps')}
            className="inline-flex items-center justify-center h-[52px] px-9 border border-white/25 text-white/80 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/50 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] active:scale-[0.98] transition-all duration-200 ease-out"
          >
            See how it works
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 text-[14px] md:text-[15px] text-white/50">
          <span>• Built for real conversations</span>
          <span>• Private by default</span>
          <span>• Works in minutes</span>
        </div>
      </section>

      {/* ════════ RELATIONSHIP MAP PREVIEW ════════ */}
      <section className="mx-auto max-w-[920px] px-6 md:px-8 py-20">
        <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-5">
          Relationship map
        </p>
        <h2 className="text-[26px] md:text-[36px] font-normal tracking-[-0.015em] text-white mb-4">
          See how people connect.
        </h2>
        <p className="text-[15px] md:text-[16px] text-white/55 leading-[1.6] mb-8 max-w-[540px]">
          Map the people who matter most and track relational dynamics over time.
        </p>
        <RelationshipMapPreview />
      </section>

      {/* ════════ DASHBOARD PREVIEW ════════ */}
      <section className="mx-auto max-w-[920px] px-6 md:px-8 py-20">
        <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-5">
          Dashboard
        </p>
        <h2 className="text-[26px] md:text-[36px] font-normal tracking-[-0.015em] text-white mb-4">
          Today&apos;s overview at a glance.
        </h2>
        <p className="text-[15px] md:text-[16px] text-white/55 leading-[1.6] mb-8 max-w-[540px]">
          A quick read on dynamics, people, and what needs care.
        </p>
        <DashboardPreview />
      </section>

      {/* ════════ FEATURE CARDS ════════ */}
      <section id="how-it-helps" className="mx-auto max-w-[920px] px-6 md:px-8 py-20">
        <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-5">
          How it helps
        </p>
        <h2 className="text-[26px] md:text-[36px] font-normal tracking-[-0.015em] text-white mb-12 md:mb-14">
          Three things that shift the dynamic.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'See the pattern', body: 'Spot what keeps repeating — without blame or guesswork.' },
            { title: 'Choose better timing', body: 'Know when to speak, pause, or wait for a cleaner opening.' },
            { title: 'Speak without escalation', body: 'Get calmer wording and a clearer plan for the moment.' },
          ].map((card) => (
            <div
              key={card.title}
              className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-xl hover:border-white/20 hover:bg-white/[0.04] hover:translate-y-[-1px] hover:scale-[1.01] transition-all duration-200 ease-out"
            >
              <h3 className="text-[18px] md:text-[20px] font-medium text-white mb-3">{card.title}</h3>
              <p className="text-[15px] md:text-[16px] text-white/65 leading-[1.6]">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ CHAT PREVIEW ════════ */}
      <section className="mx-auto max-w-[920px] px-6 md:px-8 py-20">
        <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-5">
          Chat
        </p>
        <h2 className="text-[26px] md:text-[36px] font-normal tracking-[-0.015em] text-white mb-4">
          Ask anything about a relationship.
        </h2>
        <p className="text-[15px] md:text-[16px] text-white/55 leading-[1.6] mb-8 max-w-[540px]">
          Get calm, clear guidance — never blame, never escalation.
        </p>
        <ChatPreview />
      </section>

      {/* ════════ PRICING ════════ */}
      <section className="mx-auto max-w-[920px] px-6 md:px-8 py-20">
        <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-5">
          Pricing
        </p>
        <h2 className="text-[26px] md:text-[36px] font-normal tracking-[-0.015em] text-white mb-12 md:mb-14">
          Simple, transparent plans.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Solo */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-xl flex flex-col hover:border-white/20 hover:bg-white/[0.04] hover:translate-y-[-1px] hover:scale-[1.01] transition-all duration-200 ease-out">
            <h3 className="text-[22px] md:text-[24px] font-medium text-white mb-2">Solo</h3>
            <p className="text-[32px] md:text-[36px] font-normal text-white mb-6">
              $19<span className="text-[15px] md:text-[16px] text-white/45 ml-1 font-light">/ month</span>
            </p>
            <ul className="flex flex-col gap-3 text-[15px] md:text-[16px] text-white/65 mb-10 flex-1 leading-[1.5]">
              <li>• Personal dashboard</li>
              <li>• Relationship Q&amp;A in chat</li>
              <li>• Saved history</li>
            </ul>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center h-[48px] px-6 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:bg-white/90 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] active:scale-[0.98] transition-all duration-200 ease-out"
            >
              Choose Solo
            </Link>
          </div>

          {/* Plus */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-xl flex flex-col hover:border-white/20 hover:bg-white/[0.04] hover:translate-y-[-1px] hover:scale-[1.01] transition-all duration-200 ease-out">
            <h3 className="text-[22px] md:text-[24px] font-medium text-white mb-2">Plus</h3>
            <p className="text-[32px] md:text-[36px] font-normal text-white mb-6">
              $33<span className="text-[15px] md:text-[16px] text-white/45 ml-1 font-light">/ month</span>
            </p>
            <ul className="flex flex-col gap-3 text-[15px] md:text-[16px] text-white/65 mb-10 flex-1 leading-[1.5]">
              <li>• Add family or close relationships</li>
              <li>• Compare dynamics across people</li>
              <li>• Deeper context in chat</li>
            </ul>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center h-[48px] px-6 border border-white/25 text-white/85 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/50 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] active:scale-[0.98] transition-all duration-200 ease-out"
            >
              Choose Plus
            </Link>
          </div>
        </div>
        <p className="text-[14px] text-white/40 text-center mt-8">
          Upgrade anytime. Cancel anytime.
        </p>
      </section>

      {/* ════════ PRIVACY ════════ */}
      <section className="mx-auto max-w-[920px] px-6 md:px-8 py-20">
        <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-5">
          Privacy
        </p>
        <h2 className="text-[20px] md:text-[24px] text-white font-normal mb-2">Private by default. Delete anytime.</h2>
        <p className="text-[15px] md:text-[16px] text-white/45">Your account data stays yours.</p>
      </section>

      {/* ════════ FINAL CTA ════════ */}
      <section className="mx-auto max-w-[920px] px-6 md:px-8 py-20 md:py-32">
        <h2 className="text-[26px] md:text-[36px] font-normal tracking-[-0.015em] text-white mb-4">
          Start with one relationship.
        </h2>
        <p className="text-[17px] md:text-[20px] text-white/65 mb-12 leading-[1.6]">
          Create an account and get a clear next step today.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center h-[52px] px-9 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:bg-white/90 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] active:scale-[0.98] transition-all duration-200 ease-out"
          >
            Create account
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center h-[52px] px-9 border border-white/25 text-white/80 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/50 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] active:scale-[0.98] transition-all duration-200 ease-out"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="mx-auto max-w-[920px] px-6 md:px-8 pb-16 pt-10 border-t border-white/[0.08] flex justify-between items-center flex-wrap gap-4">
        <span className="font-mono text-[11px] tracking-[0.15em] text-white/35 uppercase">
          DEFRAG © {new Date().getFullYear()}
        </span>
        <div className="flex gap-6">
          <Link href="/principles" className="font-mono text-[11px] tracking-[0.15em] text-white/35 uppercase hover:text-white/60 transition-colors duration-200">
            Principles
          </Link>
          <Link href="/contact" className="font-mono text-[11px] tracking-[0.15em] text-white/35 uppercase hover:text-white/60 transition-colors duration-200">
            Contact
          </Link>
        </div>
      </footer>

    </main>
  );
}
