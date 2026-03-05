'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';

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

/* ─── Reusable ────────────────────────────────────────────────── */

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
    </svg>
  );
}

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function MapVisualization() {
  const nodes = [
    { label: 'You', x: 50, y: 46, size: 12, delay: 0 },
    { label: 'Mom', x: 20, y: 22, size: 7.5, delay: 0.4 },
    { label: 'Partner', x: 80, y: 28, size: 8, delay: 0.9 },
    { label: 'Sister', x: 26, y: 76, size: 7, delay: 1.4 },
    { label: 'Friend', x: 76, y: 74, size: 6, delay: 1.8 },
  ];

  const edges = [
    { x1: 50, y1: 46, x2: 20, y2: 22, opacity: 0.12 },
    { x1: 50, y1: 46, x2: 80, y2: 28, opacity: 0.16 },
    { x1: 50, y1: 46, x2: 26, y2: 76, opacity: 0.09 },
    { x1: 50, y1: 46, x2: 76, y2: 74, opacity: 0.07 },
    { x1: 20, y1: 22, x2: 26, y2: 76, opacity: 0.05 },
  ];

  return (
    <div className="relative w-full h-[260px] md:h-[300px]">
      {/* Center glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)' }}
      />
      {/* Edges */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {edges.map((edge, i) => (
          <motion.line
            key={i}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke="white"
            strokeWidth="0.25"
            initial={{ opacity: 0 }}
            animate={{ opacity: edge.opacity }}
            transition={{ duration: 1.5, delay: 0.6 + i * 0.2 }}
          />
        ))}
      </svg>
      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={node.label}
          className="absolute flex flex-col items-center gap-1.5"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ opacity: 0, scale: 0.5, x: '-50%', y: '-50%' }}
          animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
          transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="rounded-full"
            style={{
              width: node.size * 2,
              height: node.size * 2,
              background: i === 0
                ? 'radial-gradient(circle, rgba(255,255,255,0.85), rgba(255,255,255,0.3))'
                : 'radial-gradient(circle, rgba(255,255,255,0.5), rgba(255,255,255,0.15))',
              boxShadow: i === 0
                ? '0 0 24px rgba(255,255,255,0.18), 0 0 48px rgba(255,255,255,0.06)'
                : '0 0 14px rgba(255,255,255,0.08)',
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [1, 0.85, 1] }}
            transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
          />
          <motion.span
            className={`font-mono text-[10px] tracking-wide whitespace-nowrap ${i === 0 ? 'text-white/70 font-semibold' : 'text-white/35'}`}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
          >
            {node.label}
          </motion.span>
        </motion.div>
      ))}
    </div>
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
    <main className="min-h-screen bg-[#09090b] text-white font-sans antialiased selection:bg-white/10 overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
        style={{ background: 'linear-gradient(to bottom, rgba(9,9,11,0.92), rgba(9,9,11,0.82))', backdropFilter: 'blur(20px) saturate(1.4)' }}
      >
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="font-mono text-[13px] font-bold tracking-[0.2em] text-white/90 uppercase">
            DEFRAG
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex items-center h-10 px-4 text-[13px] text-white/35 hover:text-white/60 transition-colors duration-200 font-mono tracking-wide"
            >
              Pricing
            </button>
            <Link
              href="/auth/login"
              className="inline-flex items-center h-10 px-4 text-[13px] text-white/35 hover:text-white/60 transition-colors duration-200 font-mono tracking-wide"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center h-10 px-5 bg-white text-[#09090b] text-[12px] font-mono font-bold uppercase tracking-[0.06em] rounded-lg motion-safe:active:scale-[0.97] transition-all duration-150 hover:bg-white/90"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-36 md:pt-48 pb-24 md:pb-36 overflow-hidden">
        {/* Subtle radial glow — breathing */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(255,255,255,0.05), rgba(255,255,255,0.015) 50%, transparent 80%)' }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30 mb-7"
          >
            Relational intelligence
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[48px] md:text-[64px] lg:text-[76px] font-bold tracking-[-0.04em] leading-[1.0] mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
              Clarity for hard
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
              relationships.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-[18px] md:text-[20px] text-white/55 leading-[1.6] mb-10 max-w-lg mx-auto"
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
              className="inline-flex items-center justify-center h-13 px-8 bg-white text-[#09090b] text-[13px] font-mono font-bold uppercase tracking-[0.08em] rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.4)] motion-safe:active:scale-[0.97] transition-all duration-150 hover:bg-white/90"
            >
              Start free
            </Link>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center h-13 px-8 border border-white/[0.10] text-white/45 text-[13px] font-mono font-bold uppercase tracking-[0.08em] rounded-xl hover:text-white/65 hover:border-white/20 hover:bg-white/[0.03] motion-safe:active:scale-[0.97] transition-all duration-200"
            >
              See how it works
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[12px] text-white/20 font-mono"
          >
            <span>Private by default</span>
            <span className="text-white/8">&middot;</span>
            <span>Delete anytime</span>
            <span className="text-white/8">&middot;</span>
            <span>No social feed</span>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Relationship Map (dark card) */}
            <FadeIn>
              <div className="relative bg-[#111113] border border-white/[0.06] rounded-2xl p-8 md:p-10 h-full flex flex-col overflow-hidden">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/30 mb-5">Relationship map</span>
                <h2 className="text-[40px] md:text-[48px] font-bold tracking-[-0.03em] leading-none text-white mb-4">
                  See the full picture.
                </h2>
                <p className="text-[15px] text-white/55 leading-[1.7] mb-6 max-w-sm">
                  Every relationship and its current state, visible at a glance. Watch dynamics shift over time.
                </p>
                <div className="mt-auto">
                  <MapVisualization />
                </div>
              </div>
            </FadeIn>

            {/* Chat (light card) */}
            <FadeIn delay={0.1}>
              <div className="relative bg-[#f0eeeb] border border-white/[0.06] rounded-2xl p-8 md:p-10 h-full flex flex-col overflow-hidden">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-black/35 mb-5">Relationship chat</span>
                <h2 className="text-[40px] md:text-[48px] font-bold tracking-[-0.03em] leading-none text-[#09090b] mb-4">
                  Ask anything.
                </h2>
                <p className="text-[15px] text-black/60 leading-[1.7] mb-8 max-w-sm">
                  Get structured answers about what&rsquo;s happening, why it keeps repeating, and what might actually help.
                </p>
                <motion.div
                  className="mt-auto space-y-3"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                >
                  {EXAMPLE_ANSWER.map((block, i) => (
                    <motion.div
                      key={block.heading}
                      variants={{
                        hidden: { opacity: 0, y: 14 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
                      }}
                      className={`rounded-xl p-5 ${i === 0 ? 'bg-[#e8e5e0] text-[#09090b]' : 'bg-[#09090b] text-white'}`}
                    >
                      <span className={`font-mono text-[11px] uppercase tracking-[0.2em] ${i === 0 ? 'text-black/40' : 'text-white/35'} block mb-2`}>
                        {block.heading.replace('\u2019', "'")}
                      </span>
                      <p className={`text-[14px] leading-[1.65] ${i === 0 ? 'text-[#09090b]/85' : 'text-white/80'}`}>
                        &ldquo;{block.body}&rdquo;
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32">
          <FadeIn>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/25 mb-4">How it works</p>
            <h2 className="text-[36px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-14">
              Three steps to clarity.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((card, i) => (
              <FadeIn key={card.step} delay={i * 0.1}>
                <div
                  className="group relative h-full border border-white/[0.06] p-7 md:p-8 rounded-2xl motion-safe:hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))' }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03), transparent 60%)' }}
                  />
                  <span className="relative inline-block font-mono text-[32px] font-extralight text-white/[0.08] mb-5 leading-none">
                    {card.step}
                  </span>
                  <h3 className="relative text-[17px] font-semibold text-white/90 mb-3">{card.title}</h3>
                  <p className="relative text-[15px] text-white/50 leading-[1.7]">{card.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32">
          <FadeIn>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/25 mb-4">What you get</p>
            <h2 className="text-[36px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-12">
              Clear answers, not vague advice.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OUTCOMES.map((item, i) => (
              <FadeIn key={item} delay={i * 0.06}>
                <div className="group flex items-start gap-3.5 border border-white/[0.06] bg-white/[0.02] p-6 rounded-2xl hover:border-white/[0.10] hover:bg-white/[0.03] transition-all duration-300">
                  <Check className="w-4 h-4 mt-1 shrink-0 text-white/30" />
                  <p className="text-[15px] text-white/55 leading-[1.6]">{item}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="relative border-t border-white/[0.06]">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.025), transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32">
          <FadeIn className="text-center mb-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/25 mb-4">Pricing</p>
            <h2 className="text-[36px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.05] text-white">
              Simple plans. Cancel anytime.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[760px] mx-auto">
            {/* Solo */}
            <FadeIn>
              <div
                className="group relative h-full border border-white/[0.06] p-7 md:p-8 rounded-2xl flex flex-col motion-safe:hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))' }}
              >
                <div className="mb-7">
                  <h3 className="text-[20px] font-semibold text-white/90">Solo</h3>
                  <p className="text-[13px] text-white/30 mt-1">For personal clarity</p>
                  <p className="text-[36px] font-bold text-white mt-4 tracking-tight">
                    $19<span className="text-[14px] font-normal text-white/25 ml-1.5">/ month</span>
                  </p>
                </div>
                <ul className="space-y-3.5 text-[14px] text-white/50 leading-relaxed flex-1 mb-8">
                  {SOLO_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Check className="w-4 h-4 shrink-0 text-white/30" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center h-12 w-full border border-white/[0.10] text-white/65 text-[13px] font-mono font-bold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/20 hover:bg-white/[0.04] motion-safe:active:scale-[0.97] transition-all duration-150"
                >
                  Start Solo
                </Link>
              </div>
            </FadeIn>

            {/* Team */}
            <FadeIn delay={0.1}>
              <div
                className="group relative h-full p-7 md:p-8 rounded-2xl flex flex-col motion-safe:hover:-translate-y-1 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 0 60px rgba(255,255,255,0.02)',
                }}
              >
                <div className="absolute -top-3 right-6">
                  <span className="inline-block font-mono text-[9px] uppercase tracking-[0.15em] px-3 py-1 rounded-full font-bold text-black bg-white">
                    Best value
                  </span>
                </div>
                <div className="mb-7">
                  <h3 className="text-[20px] font-semibold text-white/90">Team</h3>
                  <p className="text-[13px] text-white/30 mt-1">For family or close groups</p>
                  <p className="text-[36px] font-bold text-white mt-4 tracking-tight">
                    $33<span className="text-[14px] font-normal text-white/25 ml-1.5">/ month</span>
                  </p>
                </div>
                <ul className="space-y-3.5 text-[14px] text-white/50 leading-relaxed flex-1 mb-8">
                  {TEAM_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Check className="w-4 h-4 shrink-0 text-white/30" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center h-12 w-full bg-white text-[#09090b] text-[13px] font-mono font-bold uppercase tracking-[0.08em] rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.08)] motion-safe:active:scale-[0.97] transition-all duration-150 hover:bg-white/90"
                >
                  Start Team
                </Link>
              </div>
            </FadeIn>
          </div>
          <p className="text-[12px] text-white/20 text-center mt-8 font-mono tracking-wide">Upgrade anytime.</p>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-28">
          <FadeIn className="text-center mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/25 mb-4">Trust</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[900px] mx-auto">
            {TRUST_ITEMS.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div
                  className="text-center border border-white/[0.06] rounded-2xl p-7 md:p-8 motion-safe:hover:-translate-y-0.5 hover:border-white/[0.10] transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.008))' }}
                >
                  <h3 className="text-[16px] font-semibold text-white/85 mb-2.5">{item.title}</h3>
                  <p className="text-[14px] text-white/45 leading-[1.7]">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="relative border-t border-white/[0.06] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.025), transparent 60%)' }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32 text-center">
          <FadeIn>
            <h2 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.05] mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                Ready for clarity?
              </span>
            </h2>
            <p className="text-[17px] text-white/50 mb-10 max-w-md mx-auto">
              Start understanding the patterns that shape your closest relationships.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center h-13 px-10 bg-white text-[#09090b] text-[13px] font-mono font-bold uppercase tracking-[0.08em] rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.4)] motion-safe:active:scale-[0.97] transition-all duration-150 hover:bg-white/90"
            >
              Get started
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-10 flex justify-between items-center flex-wrap gap-4">
          <span className="font-mono text-[11px] tracking-[0.15em] text-white/15 uppercase">
            DEFRAG &copy; {new Date().getFullYear()}
          </span>
          <div className="flex gap-6">
            <Link href="/principles" className="font-mono text-[11px] tracking-[0.15em] text-white/15 uppercase hover:text-white/35 transition-colors duration-200 py-2">
              Principles
            </Link>
            <Link href="/contact" className="font-mono text-[11px] tracking-[0.15em] text-white/15 uppercase hover:text-white/35 transition-colors duration-200 py-2">
              Contact
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
