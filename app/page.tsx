'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { HeroPreview } from '@/components/landing/hero-preview';
import { RelationshipMapPreview } from '@/components/landing/relationship-map-preview';

/* ─── Data ────────────────────────────────────────────────────── */

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Add your details',
    body: 'Enter your birth date and time. If time is unknown, it defaults to noon.',
  },
  {
    step: '02',
    title: 'Add people',
    body: 'Add someone manually or send them an invite link to share their own details.',
  },
  {
    step: '03',
    title: 'Ask about a relationship',
    body: 'Chat returns a structured answer: what\u2019s happening, why it repeats, and what may help.',
  },
];

const EXAMPLE_ANSWER = [
  {
    heading: 'What\u2019s happening',
    body: 'Your mom interprets distance as rejection. When you set a boundary, she reads it as withdrawal\u2014not independence.',
  },
  {
    heading: 'Why it repeats',
    body: 'The pattern intensifies around transitions\u2014holidays, moves, schedule changes. Expectations shift faster than either of you can adjust.',
  },
  {
    heading: 'What may help',
    body: 'Try a short, direct opening: \u201cI need a few days to reset\u2014it\u2019s not about you.\u201d Timing matters more than wording.',
  },
];

const OUTCOMES = [
  'Understand what\u2019s actually driving tension.',
  'See why the same conflicts keep repeating.',
  'Get a concrete next step\u2014not a question back.',
  'Know when to speak and when to wait.',
];

const TRUST_ITEMS = [
  { title: 'Private by default', body: 'Your data is never shared, sold, or visible to other users.' },
  { title: 'You control sharing', body: 'Invite links only share what you allow. Nothing is exposed without consent.' },
  { title: 'Delete anytime', body: 'Remove your account and all associated data disappears permanently.' },
];

const SOLO_FEATURES = ['Personal dashboard', 'Relationship chat', 'Saved history'];
const TEAM_FEATURES = ['Everything in Solo', 'Add people + invite links', 'Relationship map', 'Deeper context in chat'];

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
    </svg>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    setMounted(true);
  }, []);

  const fade = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        };

  return (
    <main className="min-h-screen text-white font-sans antialiased selection:bg-white/20">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto max-w-[1140px] px-6 md:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="font-mono text-[13px] font-semibold tracking-[0.18em] text-white/90 uppercase">
            DEFRAG
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex items-center h-10 px-4 text-[13px] text-white/45 hover:text-white/75 transition-colors duration-200 font-mono tracking-wide"
            >
              Pricing
            </button>
            <Link
              href="/auth/login"
              className="inline-flex items-center h-10 px-4 text-[13px] text-white/45 hover:text-white/75 transition-colors duration-200 font-mono tracking-wide"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center h-10 px-5 bg-white text-[#0A0A0A] text-[12px] font-mono font-semibold uppercase tracking-[0.06em] rounded-lg hover:bg-white/90 motion-safe:active:scale-[0.97] transition-all duration-150"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="mx-auto max-w-[1140px] px-6 md:px-10 pt-20 md:pt-32 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div style={fade(0)}>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 mb-6">
              Relational clarity
            </p>
            <h1 className="text-[44px] md:text-[56px] lg:text-[64px] font-semibold tracking-[-0.035em] leading-[1.05] text-white mb-5">
              Clarity for hard relationships.
            </h1>
            <p className="text-[17px] md:text-[19px] text-white/55 leading-[1.6] mb-10 max-w-md">
              See patterns. Choose a calmer next step.
            </p>
            <div className="flex flex-col sm:flex-row gap-3.5 mb-10">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center h-12 px-8 bg-white text-[#0A0A0A] text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-lg hover:bg-white/90 motion-safe:active:scale-[0.97] transition-all duration-150 shadow-[0_0_30px_rgba(255,255,255,0.06)]"
              >
                Create account
              </Link>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center h-12 px-8 border border-white/[0.10] text-white/55 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-lg hover:text-white/75 hover:border-white/20 hover:bg-white/[0.03] motion-safe:active:scale-[0.97] transition-all duration-150"
              >
                See how it works
              </button>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-white/30 font-mono">
              <span>Private by default</span>
              <span className="text-white/10">&middot;</span>
              <span>Delete anytime</span>
              <span className="text-white/10">&middot;</span>
              <span>No social feed</span>
            </div>
          </div>
          <div style={fade(200)} className="lg:pl-4">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1140px] px-6 md:px-10 py-20 md:py-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 mb-4">How it works</p>
          <h2 className="text-[32px] md:text-[40px] font-medium tracking-[-0.025em] leading-[1.1] text-white mb-12">
            Three steps to clarity.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((card) => (
              <div
                key={card.step}
                className="group border border-white/[0.08] bg-white/[0.02] p-6 md:p-7 rounded-xl motion-safe:hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.035] transition-all duration-300"
              >
                <span className="inline-block font-mono text-[28px] font-light text-white/[0.08] mb-4 leading-none">
                  {card.step}
                </span>
                <h3 className="text-[16px] font-medium text-white/90 mb-2.5">{card.title}</h3>
                <p className="text-[14px] text-white/50 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATIONSHIP MAP ── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1140px] px-6 md:px-10 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 mb-4">Relationship map</p>
              <h2 className="text-[32px] md:text-[40px] font-medium tracking-[-0.025em] leading-[1.1] text-white mb-6">
                See the full picture.
              </h2>
              <ul className="space-y-4 text-[15px] text-white/55 leading-relaxed mb-5">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 mt-0.5 shrink-0 flex items-center justify-center rounded-full bg-white/[0.06]">
                    <span className="block w-1 h-1 rounded-full bg-white/40" />
                  </span>
                  <span>Every relationship and its current state, visible at a glance.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 mt-0.5 shrink-0 flex items-center justify-center rounded-full bg-white/[0.06]">
                    <span className="block w-1 h-1 rounded-full bg-white/40" />
                  </span>
                  <span>Watch dynamics shift over time as new information arrives.</span>
                </li>
              </ul>
              <p className="text-[12px] text-white/30 font-mono tracking-wide">Updated continuously.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] shadow-[0_8px_40px_rgba(0,0,0,0.4)] overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">Relationship map</span>
                <span className="font-mono text-[10px] text-white/15">7 connections</span>
              </div>
              <div className="p-4 md:p-6">
                <RelationshipMapPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUTPUT QUALITY ── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1140px] px-6 md:px-10 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 mb-4">What you get</p>
              <h2 className="text-[32px] md:text-[40px] font-medium tracking-[-0.025em] leading-[1.1] text-white mb-8">
                Clear answers, not vague advice.
              </h2>
              <ul className="space-y-4 text-[15px] text-white/55 leading-relaxed">
                {OUTCOMES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-4 h-4 mt-1 shrink-0 text-white/25" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] shadow-[0_8px_40px_rgba(0,0,0,0.4)] overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.06]">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">Example answer</span>
              </div>
              <div className="p-5 md:p-6">
                {EXAMPLE_ANSWER.map((block, i) => (
                  <div key={block.heading} className={i > 0 ? 'mt-5 pt-5 border-t border-white/[0.05]' : ''}>
                    <h4 className="text-[12px] font-mono font-medium text-white/55 uppercase tracking-[0.1em] mb-2">{block.heading}</h4>
                    <p className="text-[14px] text-white/45 leading-[1.7]">{block.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1140px] px-6 md:px-10 py-20 md:py-28">
          <div className="text-center mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 mb-4">Pricing</p>
            <h2 className="text-[32px] md:text-[40px] font-medium tracking-[-0.025em] leading-[1.1] text-white">
              Simple plans. Cancel anytime.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[740px] mx-auto">
            {/* Solo */}
            <div className="group border border-white/[0.08] bg-white/[0.02] p-7 rounded-xl flex flex-col motion-safe:hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.035] transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-[18px] font-medium text-white/90">Solo</h3>
                <p className="text-[13px] text-white/40 mt-1">For personal clarity</p>
                <p className="text-[32px] font-semibold text-white mt-4 tracking-tight">
                  $19<span className="text-[14px] font-normal text-white/30 ml-1.5">/ month</span>
                </p>
              </div>
              <ul className="space-y-3 text-[14px] text-white/50 leading-relaxed flex-1 mb-7">
                {SOLO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 shrink-0 text-white/25" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center h-12 w-full bg-white text-[#0A0A0A] text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-lg hover:bg-white/90 motion-safe:active:scale-[0.97] transition-all duration-150"
              >
                Start Solo
              </Link>
            </div>

            {/* Team */}
            <div className="group relative border border-white/[0.12] bg-white/[0.03] p-7 rounded-xl flex flex-col motion-safe:hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.045] transition-all duration-300">
              <div className="absolute -top-3 right-6">
                <span className="inline-block font-mono text-[9px] uppercase tracking-[0.15em] bg-white text-[#0A0A0A] px-3 py-1 rounded-full font-semibold">
                  Best value
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-[18px] font-medium text-white/90">Team</h3>
                <p className="text-[13px] text-white/40 mt-1">For family or close groups</p>
                <p className="text-[32px] font-semibold text-white mt-4 tracking-tight">
                  $33<span className="text-[14px] font-normal text-white/30 ml-1.5">/ month</span>
                </p>
              </div>
              <ul className="space-y-3 text-[14px] text-white/50 leading-relaxed flex-1 mb-7">
                {TEAM_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 shrink-0 text-white/25" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center h-12 w-full border border-white/[0.12] text-white/70 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-lg hover:text-white hover:border-white/25 hover:bg-white/[0.04] motion-safe:active:scale-[0.97] transition-all duration-150"
              >
                Start Team
              </Link>
            </div>
          </div>
          <p className="text-[12px] text-white/30 text-center mt-8 font-mono tracking-wide">Upgrade anytime.</p>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1140px] px-6 md:px-10 py-20 md:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 mb-10 text-center">Trust</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[880px] mx-auto">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.title}
                className="text-center border border-white/[0.06] bg-white/[0.015] rounded-xl p-6 md:p-7"
              >
                <h3 className="text-[15px] font-medium text-white/85 mb-2.5">{item.title}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1140px] px-6 md:px-10 py-10 flex justify-between items-center flex-wrap gap-4">
          <span className="font-mono text-[11px] tracking-[0.15em] text-white/20 uppercase">
            DEFRAG &copy; {new Date().getFullYear()}
          </span>
          <div className="flex gap-6">
            <Link href="/principles" className="font-mono text-[11px] tracking-[0.15em] text-white/20 uppercase hover:text-white/45 transition-colors duration-200 py-2">
              Principles
            </Link>
            <Link href="/contact" className="font-mono text-[11px] tracking-[0.15em] text-white/20 uppercase hover:text-white/45 transition-colors duration-200 py-2">
              Contact
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
