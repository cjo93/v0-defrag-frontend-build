'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { HeroAnimation } from '@/components/landing/hero-animation';
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
  { icon: '🔒', title: 'Private by default', body: 'Your data is never shared, sold, or visible to other users.' },
  { icon: '🔗', title: 'You control sharing', body: 'Invite links only share what you allow. Nothing is exposed without consent.' },
  { icon: '🗑', title: 'Delete anytime', body: 'Remove your account and all associated data disappears permanently.' },
];

const SOLO_FEATURES = ['Personal dashboard', 'Relationship chat', 'Saved history'];
const TEAM_FEATURES = ['Everything in Solo', 'Add people + invite links', 'Relationship map', 'Deeper context in chat'];

/* ─── Reusable components ─────────────────────────────────────── */

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
    </svg>
  );
}

function FadeInSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GradientText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-[#8b8bf6] ${className}`}
    >
      {children}
    </span>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */

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

  return (
    <main className="min-h-screen text-white font-sans antialiased selection:bg-purple-500/20 overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
        style={{ background: 'linear-gradient(to bottom, rgba(8,8,12,0.9), rgba(8,8,12,0.8))', backdropFilter: 'blur(20px) saturate(1.5)' }}
      >
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="font-mono text-[13px] font-bold tracking-[0.2em] text-white/90 uppercase">
            DEFRAG
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex items-center h-10 px-4 text-[13px] text-white/40 hover:text-white/70 transition-colors duration-200 font-mono tracking-wide"
            >
              Pricing
            </button>
            <Link
              href="/auth/login"
              className="inline-flex items-center h-10 px-4 text-[13px] text-white/40 hover:text-white/70 transition-colors duration-200 font-mono tracking-wide"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center h-10 px-5 text-[12px] font-mono font-bold uppercase tracking-[0.06em] rounded-lg motion-safe:active:scale-[0.97] transition-all duration-150"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                color: '#fff',
                boxShadow: '0 0 20px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 md:pt-44 pb-24 md:pb-36 overflow-hidden">
        {/* Background gradient orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(139,92,246,0.15), rgba(99,102,241,0.05) 50%, transparent 80%)',
          }}
        />

        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-purple-400/70 mb-7"
            >
              Relational intelligence
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[48px] md:text-[64px] lg:text-[76px] font-bold tracking-[-0.04em] leading-[1.0] mb-6"
            >
              <GradientText>Clarity for hard</GradientText>
              <br />
              <GradientText>relationships.</GradientText>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-[18px] md:text-[20px] text-white/50 leading-[1.6] mb-10 max-w-lg mx-auto"
            >
              See patterns. Understand timing. Choose a calmer next step.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center h-13 px-8 text-[13px] font-mono font-bold uppercase tracking-[0.08em] rounded-xl motion-safe:active:scale-[0.97] transition-all duration-150"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                  color: '#fff',
                  boxShadow: '0 0 40px rgba(139,92,246,0.25), 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
              >
                Start free
              </Link>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center h-13 px-8 border border-white/[0.10] text-white/50 text-[13px] font-mono font-bold uppercase tracking-[0.08em] rounded-xl hover:text-white/70 hover:border-white/20 hover:bg-white/[0.03] motion-safe:active:scale-[0.97] transition-all duration-200"
              >
                See how it works
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[12px] text-white/25 font-mono"
            >
              <span>Private by default</span>
              <span className="text-white/10">&middot;</span>
              <span>Delete anytime</span>
              <span className="text-white/10">&middot;</span>
              <span>No social feed</span>
            </motion.div>
          </div>

          {/* Animated constellation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 md:mt-20 max-w-2xl mx-auto"
          >
            <HeroAnimation />
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32">
          <FadeInSection>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-purple-400/60 mb-4">How it works</p>
            <h2 className="text-[36px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-14">
              Three steps to clarity.
            </h2>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((card, i) => (
              <FadeInSection key={card.step} delay={i * 0.1}>
                <div
                  className="group relative h-full border border-white/[0.06] p-7 md:p-8 rounded-2xl motion-safe:hover:-translate-y-1 hover:border-purple-500/20 transition-all duration-300 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(139,92,246,0.02))' }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.08), transparent 60%)' }}
                  />
                  <span className="relative inline-block font-mono text-[32px] font-extralight text-purple-500/20 mb-5 leading-none">
                    {card.step}
                  </span>
                  <h3 className="relative text-[17px] font-semibold text-white/90 mb-3">{card.title}</h3>
                  <p className="relative text-[14px] text-white/45 leading-[1.7]">{card.body}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATIONSHIP MAP ── */}
      <section className="relative border-t border-white/[0.06]">
        {/* Background accent */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 100% 0%, rgba(99,102,241,0.06), transparent 60%)' }}
        />
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <FadeInSection>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-purple-400/60 mb-4">Relationship map</p>
              <h2 className="text-[36px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-7">
                See the full picture.
              </h2>
              <ul className="space-y-5 text-[15px] text-white/55 leading-[1.7] mb-6">
                <li className="flex items-start gap-3.5">
                  <span className="w-6 h-6 mt-0.5 shrink-0 flex items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/[0.06]">
                    <span className="block w-1.5 h-1.5 rounded-full bg-purple-400/50" />
                  </span>
                  <span>Every relationship and its current state, visible at a glance.</span>
                </li>
                <li className="flex items-start gap-3.5">
                  <span className="w-6 h-6 mt-0.5 shrink-0 flex items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/[0.06]">
                    <span className="block w-1.5 h-1.5 rounded-full bg-purple-400/50" />
                  </span>
                  <span>Watch dynamics shift over time as new information arrives.</span>
                </li>
              </ul>
              <p className="text-[12px] text-white/25 font-mono tracking-wide">Updated continuously.</p>
            </FadeInSection>
            <FadeInSection delay={0.15}>
              <div
                className="rounded-2xl border border-white/[0.06] overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(139,92,246,0.02))',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.3), 0 0 60px rgba(139,92,246,0.04)',
                }}
              >
                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">Relationship map</span>
                  <span className="font-mono text-[10px] text-purple-400/30">7 connections</span>
                </div>
                <div className="p-4 md:p-6">
                  <RelationshipMapPreview />
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── OUTPUT QUALITY ── */}
      <section className="relative border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            <FadeInSection>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-purple-400/60 mb-4">What you get</p>
              <h2 className="text-[36px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-8">
                Clear answers, not vague advice.
              </h2>
              <ul className="space-y-5 text-[15px] text-white/55 leading-[1.7]">
                {OUTCOMES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-4 h-4 mt-1 shrink-0 text-purple-400/50" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </FadeInSection>
            <FadeInSection delay={0.15}>
              <div
                className="rounded-2xl border border-white/[0.06] overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(139,92,246,0.02))',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.3), 0 0 60px rgba(139,92,246,0.04)',
                }}
              >
                <div className="px-5 py-3 border-b border-white/[0.06]">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">Example answer</span>
                </div>
                <div className="p-5 md:p-7">
                  {EXAMPLE_ANSWER.map((block, i) => (
                    <div key={block.heading} className={i > 0 ? 'mt-5 pt-5 border-t border-white/[0.04]' : ''}>
                      <h4 className="text-[11px] font-mono font-semibold text-purple-400/50 uppercase tracking-[0.15em] mb-2">{block.heading}</h4>
                      <p className="text-[14px] text-white/45 leading-[1.8]">{block.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="relative border-t border-white/[0.06]">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06), transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32">
          <FadeInSection className="text-center mb-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-purple-400/60 mb-4">Pricing</p>
            <h2 className="text-[36px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.05] text-white">
              Simple plans. Cancel anytime.
            </h2>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[760px] mx-auto">
            {/* Solo */}
            <FadeInSection>
              <div
                className="group relative h-full border border-white/[0.06] p-7 md:p-8 rounded-2xl flex flex-col motion-safe:hover:-translate-y-1 hover:border-purple-500/20 transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(139,92,246,0.02))' }}
              >
                <div className="mb-7">
                  <h3 className="text-[20px] font-semibold text-white/90">Solo</h3>
                  <p className="text-[13px] text-white/35 mt-1">For personal clarity</p>
                  <p className="text-[36px] font-bold text-white mt-4 tracking-tight">
                    $19<span className="text-[14px] font-normal text-white/25 ml-1.5">/ month</span>
                  </p>
                </div>
                <ul className="space-y-3.5 text-[14px] text-white/45 leading-relaxed flex-1 mb-8">
                  {SOLO_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Check className="w-4 h-4 shrink-0 text-purple-400/40" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center h-12 w-full border border-white/[0.10] text-white/70 text-[13px] font-mono font-bold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/20 hover:bg-white/[0.04] motion-safe:active:scale-[0.97] transition-all duration-150"
                >
                  Start Solo
                </Link>
              </div>
            </FadeInSection>

            {/* Team */}
            <FadeInSection delay={0.1}>
              <div
                className="group relative h-full p-7 md:p-8 rounded-2xl flex flex-col motion-safe:hover:-translate-y-1 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.04))',
                  border: '1px solid rgba(139,92,246,0.2)',
                  boxShadow: '0 0 40px rgba(139,92,246,0.06)',
                }}
              >
                <div className="absolute -top-3 right-6">
                  <span
                    className="inline-block font-mono text-[9px] uppercase tracking-[0.15em] px-3 py-1 rounded-full font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                  >
                    Best value
                  </span>
                </div>
                <div className="mb-7">
                  <h3 className="text-[20px] font-semibold text-white/90">Team</h3>
                  <p className="text-[13px] text-white/35 mt-1">For family or close groups</p>
                  <p className="text-[36px] font-bold text-white mt-4 tracking-tight">
                    $33<span className="text-[14px] font-normal text-white/25 ml-1.5">/ month</span>
                  </p>
                </div>
                <ul className="space-y-3.5 text-[14px] text-white/45 leading-relaxed flex-1 mb-8">
                  {TEAM_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Check className="w-4 h-4 shrink-0 text-purple-400/40" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center h-12 w-full text-[13px] font-mono font-bold uppercase tracking-[0.08em] rounded-xl motion-safe:active:scale-[0.97] transition-all duration-150"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    color: '#fff',
                    boxShadow: '0 0 20px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  Start Team
                </Link>
              </div>
            </FadeInSection>
          </div>
          <p className="text-[12px] text-white/25 text-center mt-8 font-mono tracking-wide">Upgrade anytime.</p>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-28">
          <FadeInSection className="text-center mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-purple-400/60 mb-4">Trust</p>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[900px] mx-auto">
            {TRUST_ITEMS.map((item, i) => (
              <FadeInSection key={item.title} delay={i * 0.1}>
                <div
                  className="text-center border border-white/[0.06] rounded-2xl p-7 md:p-8 motion-safe:hover:-translate-y-0.5 hover:border-purple-500/15 transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(139,92,246,0.015))' }}
                >
                  <div className="text-2xl mb-4">{item.icon}</div>
                  <h3 className="text-[16px] font-semibold text-white/85 mb-2.5">{item.title}</h3>
                  <p className="text-[13px] text-white/40 leading-[1.7]">{item.body}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="relative border-t border-white/[0.06] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.06), transparent 60%)' }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32 text-center">
          <FadeInSection>
            <h2 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.05] mb-6">
              <GradientText>Ready for clarity?</GradientText>
            </h2>
            <p className="text-[17px] text-white/45 mb-10 max-w-md mx-auto">
              Start understanding the patterns that shape your closest relationships.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center h-13 px-10 text-[13px] font-mono font-bold uppercase tracking-[0.08em] rounded-xl motion-safe:active:scale-[0.97] transition-all duration-150"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                color: '#fff',
                boxShadow: '0 0 40px rgba(139,92,246,0.25), 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              Create account
            </Link>
          </FadeInSection>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-10 flex justify-between items-center flex-wrap gap-4">
          <span className="font-mono text-[11px] tracking-[0.15em] text-white/15 uppercase">
            DEFRAG &copy; {new Date().getFullYear()}
          </span>
          <div className="flex gap-6">
            <Link href="/principles" className="font-mono text-[11px] tracking-[0.15em] text-white/15 uppercase hover:text-white/40 transition-colors duration-200 py-2">
              Principles
            </Link>
            <Link href="/contact" className="font-mono text-[11px] tracking-[0.15em] text-white/15 uppercase hover:text-white/40 transition-colors duration-200 py-2">
              Contact
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
