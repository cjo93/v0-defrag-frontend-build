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
  { title: 'PRIVATE BY DEFAULT', body: 'Your data is never shared, sold, or visible to other users.' },
  { title: 'YOU CONTROL SHARING', body: 'Invite links only share what you allow. Nothing is exposed without consent.' },
  { title: 'DELETE ANYTIME', body: 'Remove your account and all associated data disappears permanently.' },
];

const SOLO_FEATURES = ['Personal dashboard', 'Relationship chat', 'Saved history'];
const TEAM_FEATURES = ['Everything in Solo', 'Add people + invite links', 'Relationship map', 'Deeper context in chat'];

/* ─── Reusable ────────────────────────────────────────────────── */

function Dash({ className }: { className?: string }) {
  return <span className={`inline-block w-3 h-[2px] bg-[#e8613a] ${className ?? ''}`} />;
}

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 1, 0.5, 1] }}
      className={className}
    >
      {children}
    </motion.div>
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

  useEffect(() => { setMounted(true); }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased selection:bg-[#e8613a]/20 overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 h-14 flex items-center justify-between">
          <Link href="/" className="font-mono text-[14px] font-black tracking-[0.15em] text-white uppercase">
            DEFRAG
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex items-center h-9 px-4 text-[11px] text-white/30 hover:text-white/60 transition-colors font-mono uppercase tracking-[0.15em]"
            >
              Pricing
            </button>
            <Link
              href="/auth/login"
              className="inline-flex items-center h-9 px-4 text-[11px] text-white/30 hover:text-white/60 transition-colors font-mono uppercase tracking-[0.15em]"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center h-9 px-5 border border-[#e8613a] text-[#e8613a] text-[11px] font-mono font-bold uppercase tracking-[0.12em] rounded-full hover:bg-[#e8613a] hover:text-white motion-safe:active:scale-[0.97] transition-all duration-150"
            >
              Initialize
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-28 md:pt-36 pb-20 md:pb-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — constellation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="order-2 lg:order-1"
            >
              <HeroAnimation />
            </motion.div>

            {/* Right — copy */}
            <div className="order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={mounted ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-3 mb-8"
              >
                <span className="block w-8 h-[1px] bg-[#e8613a]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#e8613a]">DEFRAG_INIT</span>
                <span className="block flex-1 h-[1px] bg-white/[0.06]" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                className="text-[40px] md:text-[52px] lg:text-[60px] font-black tracking-[-0.03em] leading-[1.0] uppercase mb-5"
              >
                The user manual for{' '}
                <span className="text-[#e8613a]">your people.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={mounted ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="font-mono text-[12px] uppercase tracking-[0.2em] text-white/35 mb-8"
              >
                Stop guessing. Start operating.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
                className="text-[15px] text-white/40 leading-[1.7] mb-10 max-w-md font-mono"
              >
                Too many theories, not enough instructions. Defrag translates relational noise into clear, structured guidance.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center h-12 px-8 bg-white text-[#0a0a0a] text-[12px] font-mono font-black uppercase tracking-[0.12em] rounded-sm hover:bg-white/90 motion-safe:active:scale-[0.97] transition-all duration-150"
                >
                  Initialize Defrag
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={mounted ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20"
              >
                Simple instructions for difficult people.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODULE CARDS ── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Module 01 — MAP (dark card) */}
            <FadeIn>
              <div className="relative bg-[#111] border border-white/[0.06] rounded-[20px] p-8 md:p-10 h-full flex flex-col overflow-hidden">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 mb-5">Module_01 // Map</span>
                <h2 className="text-[48px] md:text-[56px] font-black uppercase tracking-[-0.02em] leading-none text-white mb-4">
                  MAP.
                </h2>
                <p className="text-[14px] text-white/40 leading-[1.7] mb-8 max-w-sm">
                  Every relationship and its current state. See where things stand at a glance.
                </p>
                <div className="mt-auto">
                  <RelationshipMapPreview />
                </div>
              </div>
            </FadeIn>

            {/* Module 02 — CLARITY (light card) */}
            <FadeIn delay={0.1}>
              <div className="relative bg-[#f0eeeb] border border-white/[0.06] rounded-[20px] p-8 md:p-10 h-full flex flex-col overflow-hidden">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/30 mb-5">Module_02 // Chat</span>
                <h2 className="text-[48px] md:text-[56px] font-black uppercase tracking-[-0.02em] leading-none text-[#0a0a0a] mb-4">
                  CLARITY.
                </h2>
                <p className="text-[14px] text-black/50 leading-[1.7] mb-8 max-w-sm">
                  Translate behavior into structural documentation. No more guessing why the wall is up.
                </p>
                <div className="mt-auto space-y-3">
                  {EXAMPLE_ANSWER.map((block, i) => (
                    <div
                      key={block.heading}
                      className={`rounded-xl p-5 ${i === 0 ? 'bg-[#e8e5e0] text-[#0a0a0a]' : 'bg-[#0a0a0a] text-white'}`}
                    >
                      <span className={`font-mono text-[9px] uppercase tracking-[0.2em] ${i === 0 ? 'text-black/30' : 'text-white/25'} block mb-2`}>
                        {block.heading.replace('\u2019', "'")}
                      </span>
                      <p className={`text-[14px] font-semibold leading-[1.5] ${i === 0 ? 'text-[#0a0a0a]' : 'text-white/90'}`}>
                        &ldquo;{block.body}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 md:py-28">
          <FadeIn>
            <div className="flex items-center gap-3 mb-4">
              <Dash />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#e8613a]">Protocol</span>
            </div>
            <h2 className="text-[36px] md:text-[44px] font-black uppercase tracking-[-0.02em] leading-[1.0] text-white mb-14">
              Three steps to clarity.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((card, i) => (
              <FadeIn key={card.step} delay={i * 0.08}>
                <div className="h-full border border-white/[0.06] bg-white/[0.02] p-7 md:p-8 rounded-[16px] hover:border-white/[0.12] motion-safe:hover:-translate-y-0.5 transition-all duration-300">
                  <span className="inline-block font-mono text-[36px] font-black text-white/[0.06] leading-none mb-5">
                    {card.step}
                  </span>
                  <h3 className="text-[16px] font-bold text-white/90 uppercase tracking-wide mb-3">{card.title}</h3>
                  <p className="text-[14px] text-white/35 leading-[1.7]">{card.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 md:py-28">
          <FadeIn>
            <div className="flex items-center gap-3 mb-4">
              <Dash />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#e8613a]">Output</span>
            </div>
            <h2 className="text-[36px] md:text-[44px] font-black uppercase tracking-[-0.02em] leading-[1.0] text-white mb-12">
              Clear answers, not vague advice.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {OUTCOMES.map((item, i) => (
              <FadeIn key={item} delay={i * 0.06}>
                <div className="flex items-start gap-4 border border-white/[0.06] bg-white/[0.02] p-6 rounded-[16px]">
                  <span className="font-mono text-[10px] text-[#e8613a] mt-1 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-[15px] text-white/50 leading-[1.6]">{item}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 md:py-28">
          <FadeIn className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="block w-6 h-[1px] bg-white/[0.08]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#e8613a]">Pricing</span>
              <span className="block w-6 h-[1px] bg-white/[0.08]" />
            </div>
            <h2 className="text-[36px] md:text-[44px] font-black uppercase tracking-[-0.02em] leading-[1.0] text-white">
              Simple plans. Cancel anytime.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[740px] mx-auto">
            {/* Solo */}
            <FadeIn>
              <div className="h-full border border-white/[0.06] bg-white/[0.02] p-7 md:p-8 rounded-[20px] flex flex-col hover:border-white/[0.12] motion-safe:hover:-translate-y-0.5 transition-all duration-300">
                <div className="mb-6">
                  <h3 className="text-[18px] font-black uppercase tracking-[0.05em] text-white/90">Solo</h3>
                  <p className="text-[12px] text-white/25 mt-1 font-mono uppercase tracking-wide">Personal clarity</p>
                  <p className="text-[36px] font-black text-white mt-5 tracking-tight">
                    $19<span className="text-[13px] font-normal text-white/20 ml-1.5">/ month</span>
                  </p>
                </div>
                <ul className="space-y-3 text-[13px] text-white/40 leading-relaxed flex-1 mb-7 font-mono">
                  {SOLO_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Dash className="w-2 h-[1.5px]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center h-11 w-full bg-white text-[#0a0a0a] text-[11px] font-mono font-black uppercase tracking-[0.12em] rounded-sm hover:bg-white/90 motion-safe:active:scale-[0.97] transition-all duration-150"
                >
                  Start Solo
                </Link>
              </div>
            </FadeIn>

            {/* Team */}
            <FadeIn delay={0.08}>
              <div className="h-full relative border border-[#e8613a]/30 bg-[#e8613a]/[0.04] p-7 md:p-8 rounded-[20px] flex flex-col hover:border-[#e8613a]/50 motion-safe:hover:-translate-y-0.5 transition-all duration-300">
                <div className="absolute -top-3 right-6">
                  <span className="inline-block font-mono text-[9px] uppercase tracking-[0.12em] bg-[#e8613a] text-white px-3 py-1 rounded-sm font-bold">
                    Best value
                  </span>
                </div>
                <div className="mb-6">
                  <h3 className="text-[18px] font-black uppercase tracking-[0.05em] text-white/90">Team</h3>
                  <p className="text-[12px] text-white/25 mt-1 font-mono uppercase tracking-wide">Family or close groups</p>
                  <p className="text-[36px] font-black text-white mt-5 tracking-tight">
                    $33<span className="text-[13px] font-normal text-white/20 ml-1.5">/ month</span>
                  </p>
                </div>
                <ul className="space-y-3 text-[13px] text-white/40 leading-relaxed flex-1 mb-7 font-mono">
                  {TEAM_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Dash className="w-2 h-[1.5px]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center h-11 w-full bg-[#e8613a] text-white text-[11px] font-mono font-black uppercase tracking-[0.12em] rounded-sm hover:bg-[#d4552a] motion-safe:active:scale-[0.97] transition-all duration-150"
                >
                  Start Team
                </Link>
              </div>
            </FadeIn>
          </div>
          <p className="text-[11px] text-white/15 text-center mt-8 font-mono uppercase tracking-[0.15em]">Upgrade anytime.</p>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 md:py-24">
          <FadeIn className="text-center mb-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/15">Trust</span>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[880px] mx-auto">
            {TRUST_ITEMS.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.06}>
                <div className="text-center border border-white/[0.06] bg-white/[0.015] rounded-[16px] p-6 md:p-7">
                  <h3 className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-[0.15em] mb-3">{item.title}</h3>
                  <p className="text-[13px] text-white/30 leading-[1.7]">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 md:py-28 text-center">
          <FadeIn>
            <h2 className="text-[36px] md:text-[48px] font-black uppercase tracking-[-0.02em] leading-[1.0] mb-5">
              Ready to <span className="text-[#e8613a]">operate?</span>
            </h2>
            <p className="text-[14px] text-white/30 mb-10 max-w-sm mx-auto font-mono leading-[1.7]">
              Start understanding the patterns that shape your closest relationships.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center h-12 px-10 bg-white text-[#0a0a0a] text-[12px] font-mono font-black uppercase tracking-[0.12em] rounded-sm hover:bg-white/90 motion-safe:active:scale-[0.97] transition-all duration-150"
            >
              Initialize Defrag
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-8 flex justify-between items-center flex-wrap gap-4">
          <span className="font-mono text-[10px] tracking-[0.15em] text-white/15 uppercase">
            DEFRAG &copy; {new Date().getFullYear()}
          </span>
          <div className="flex gap-6">
            <Link href="/principles" className="font-mono text-[10px] tracking-[0.15em] text-white/15 uppercase hover:text-white/30 transition-colors py-2">
              Principles
            </Link>
            <Link href="/contact" className="font-mono text-[10px] tracking-[0.15em] text-white/15 uppercase hover:text-white/30 transition-colors py-2">
              Contact
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
