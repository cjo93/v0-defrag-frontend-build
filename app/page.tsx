'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { HeroPreview } from '@/components/landing/hero-preview';
import { RelationshipMapPreview } from '@/components/landing/relationship-map-preview';

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

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fade = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(8px)',
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  });

  return (
    <main className="min-h-screen text-white font-sans antialiased">

      {/* ── 1. TOP NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-md">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8 h-14 flex items-center justify-between">
          <span className="font-mono text-[13px] font-semibold tracking-[0.15em] text-white/90 uppercase">
            DEFRAG
          </span>
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex px-3 py-2 text-[13px] text-white/50 hover:text-white/80 transition-colors duration-200 font-mono tracking-wide"
            >
              Pricing
            </button>
            <Link
              href="/auth/login"
              className="px-3 py-2 text-[13px] text-white/50 hover:text-white/80 transition-colors duration-200 font-mono tracking-wide"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center h-9 px-4 bg-white text-black text-[12px] font-mono font-semibold uppercase tracking-[0.06em] rounded-sm hover:bg-white/90 active:scale-[0.98] transition-all duration-200"
            >
              Create account
            </Link>
          </div>
        </div>
      </nav>

      {/* ── 2. HERO ── */}
      <section className="mx-auto max-w-[1100px] px-5 md:px-8 pt-16 md:pt-24 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div style={fade(0)}>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40 mb-5">
              Relational clarity
            </p>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.1] text-white mb-4">
              Clarity for hard relationships.
            </h1>
            <p className="text-[15px] md:text-[16px] text-white/55 leading-relaxed mb-8">
              See patterns. Choose a calmer next step.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center h-12 px-8 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:bg-white/90 active:scale-[0.98] transition-all duration-200 shadow-[0_0_24px_rgba(255,255,255,0.08)]"
              >
                Create account
              </Link>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center h-12 px-8 border border-white/10 text-white/60 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:text-white/80 hover:border-white/20 active:scale-[0.98] transition-all duration-200"
              >
                See how it works
              </button>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-white/30 font-mono">
              <span>Private by default</span>
              <span className="text-white/15">&bull;</span>
              <span>Delete anytime</span>
              <span className="text-white/15">&bull;</span>
              <span>No social feed</span>
            </div>
          </div>
          <div style={fade(150)} className="lg:pl-4">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ── */}
      <section id="how-it-works" className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8 py-16 md:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40 mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-10">
            Three steps to clarity.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((card) => (
              <div
                key={card.step}
                className="border border-white/10 bg-white/[0.02] p-6 rounded-sm hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200"
              >
                <span className="font-mono text-[11px] text-white/25 tracking-[0.15em]">{card.step}</span>
                <h3 className="text-[16px] font-medium text-white mt-3 mb-2">{card.title}</h3>
                <p className="text-[14px] text-white/50 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. PRODUCT SURFACES — Relationship Map ── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40 mb-3">Relationship map</p>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-5">
                See the full picture.
              </h2>
              <ul className="space-y-3 text-[14px] text-white/55 leading-relaxed mb-4">
                <li className="flex items-start gap-2.5">
                  <span className="text-white/20 mt-0.5">&mdash;</span>
                  <span>Every relationship and its current state, visible at a glance.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-white/20 mt-0.5">&mdash;</span>
                  <span>Watch dynamics shift over time as new information arrives.</span>
                </li>
              </ul>
              <p className="text-[12px] text-white/30 font-mono">Updated continuously.</p>
            </div>
            <div className="border border-white/10 bg-white/[0.02] rounded-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.06]">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">Relationship map</span>
              </div>
              <div className="p-4 md:p-6">
                <RelationshipMapPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. OUTPUT QUALITY ── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40 mb-3">What you get</p>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-6">
                Clear answers, not vague advice.
              </h2>
              <ul className="space-y-4 text-[14px] text-white/55 leading-relaxed">
                {OUTCOMES.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="text-white/20 mt-0.5">&mdash;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-white/10 bg-white/[0.02] rounded-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.06]">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">Example answer</span>
              </div>
              <div className="p-5 space-y-4">
                {EXAMPLE_ANSWER.map((block) => (
                  <div key={block.heading}>
                    <h4 className="text-[13px] font-mono font-medium text-white/70 mb-1.5">{block.heading}</h4>
                    <p className="text-[13px] text-white/45 leading-relaxed">{block.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. PRICING ── */}
      <section id="pricing" className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8 py-16 md:py-24">
          <div className="text-center mb-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40 mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white">
              Simple plans. Cancel anytime.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[720px] mx-auto">
            {/* Solo */}
            <div className="border border-white/10 bg-white/[0.02] p-6 rounded-sm flex flex-col hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200">
              <div className="mb-5">
                <h3 className="text-[18px] font-medium text-white">Solo</h3>
                <p className="text-[12px] text-white/40 mt-1">For personal clarity</p>
                <p className="text-[28px] font-medium text-white mt-3">
                  $19<span className="text-[13px] font-normal text-white/35 ml-1">/ month</span>
                </p>
              </div>
              <ul className="space-y-2.5 text-[13px] text-white/50 leading-relaxed flex-1 mb-6">
                <li>Personal dashboard</li>
                <li>Relationship chat</li>
                <li>Saved history</li>
              </ul>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center h-12 w-full bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:bg-white/90 active:scale-[0.98] transition-all duration-200"
              >
                Start Solo
              </Link>
            </div>

            {/* Team */}
            <div className="border border-white/10 bg-white/[0.02] p-6 rounded-sm flex flex-col hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200">
              <div className="mb-5">
                <h3 className="text-[18px] font-medium text-white">Team</h3>
                <p className="text-[12px] text-white/40 mt-1">For family or close groups</p>
                <p className="text-[28px] font-medium text-white mt-3">
                  $33<span className="text-[13px] font-normal text-white/35 ml-1">/ month</span>
                </p>
              </div>
              <ul className="space-y-2.5 text-[13px] text-white/50 leading-relaxed flex-1 mb-6">
                <li>Add people + invite links</li>
                <li>Relationship map</li>
                <li>Deeper context in chat</li>
              </ul>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center h-12 w-full border border-white/10 text-white/70 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:text-white hover:border-white/20 active:scale-[0.98] transition-all duration-200"
              >
                Start Team
              </Link>
            </div>
          </div>
          <p className="text-[12px] text-white/30 text-center mt-6 font-mono">Upgrade anytime.</p>
        </div>
      </section>

      {/* ── 7. TRUST ── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8 py-16 md:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40 mb-8 text-center">Trust</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[840px] mx-auto">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="text-center">
                <h3 className="text-[15px] font-medium text-white mb-2">{item.title}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8 py-10 flex justify-between items-center flex-wrap gap-4">
          <span className="font-mono text-[11px] tracking-[0.15em] text-white/25 uppercase">
            DEFRAG &copy; {new Date().getFullYear()}
          </span>
          <div className="flex gap-6">
            <Link href="/principles" className="font-mono text-[11px] tracking-[0.15em] text-white/25 uppercase hover:text-white/50 transition-colors duration-200 py-2">
              Principles
            </Link>
            <Link href="/contact" className="font-mono text-[11px] tracking-[0.15em] text-white/25 uppercase hover:text-white/50 transition-colors duration-200 py-2">
              Contact
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
