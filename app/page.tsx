'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform, useMotionValue } from 'framer-motion';
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

const EASE = [0.16, 1, 0.3, 1] as const;

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
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Spotlight card wrapper ─── */

function SpotlightCard({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set((e.clientX - rect.left) / rect.width);
      my.set((e.clientY - rect.top) / rect.height);
    },
    [mx, my],
  );

  const handleLeave = useCallback(() => {
    mx.set(0.5);
    my.set(0.5);
  }, [mx, my]);

  const spotX = useTransform(mx, (v) => `${v * 100}%`);
  const spotY = useTransform(my, (v) => `${v * 100}%`);

  return (
    <div ref={ref} className={`relative ${className}`} style={style} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [spotX, spotY],
            ([x, y]) => `radial-gradient(400px circle at ${x} ${y}, rgba(255,255,255,0.06), transparent 60%)`,
          ),
        }}
      />
      {children}
    </div>
  );
}

/* ─── Map visualization ─── */

function MapVisualization() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const nodes = [
    { label: 'You', x: 50, y: 44, size: 13, delay: 0, ring: true },
    { label: 'Mom', x: 18, y: 20, size: 7.5, delay: 0.3, ring: false },
    { label: 'Partner', x: 82, y: 24, size: 8, delay: 0.5, ring: false },
    { label: 'Dad', x: 35, y: 75, size: 6.5, delay: 0.7, ring: false },
    { label: 'Sister', x: 68, y: 78, size: 7, delay: 0.9, ring: false },
    { label: 'Friend', x: 14, y: 55, size: 5.5, delay: 1.1, ring: false },
    { label: 'Coworker', x: 88, y: 58, size: 5, delay: 1.3, ring: false },
  ];

  const edges = [
    { from: 0, to: 1, strength: 0.18 },
    { from: 0, to: 2, strength: 0.22 },
    { from: 0, to: 3, strength: 0.12 },
    { from: 0, to: 4, strength: 0.14 },
    { from: 0, to: 5, strength: 0.08 },
    { from: 0, to: 6, strength: 0.06 },
    { from: 1, to: 3, strength: 0.07 },
    { from: 1, to: 4, strength: 0.06 },
    { from: 2, to: 6, strength: 0.04 },
  ];

  return (
    <div ref={ref} className="relative w-full h-[280px] md:h-[320px]">
      {/* Ambient center glow */}
      <motion.div
        className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06), transparent 65%)' }}
        animate={inView ? { opacity: [0.5, 0.8, 0.5], scale: [0.95, 1.05, 0.95] } : {}}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Orbital ring */}
      <motion.div
        className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 0.06, scale: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
      >
        <div className="w-[200px] h-[200px] rounded-full border border-white/[0.08]" />
      </motion.div>
      <motion.div
        className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 0.04, scale: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
      >
        <div className="w-[320px] h-[320px] rounded-full border border-white/[0.06]" />
      </motion.div>

      {/* Edges */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="50%" stopColor="white" stopOpacity="0.06" />
            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {edges.map((edge, i) => {
          const a = nodes[edge.from];
          const b = nodes[edge.to];
          return (
            <motion.line
              key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="url(#edgeGrad)"
              strokeWidth="0.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: edge.strength } : {}}
              transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: EASE }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={node.label}
          className="absolute flex flex-col items-center"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ opacity: 0, scale: 0.3, x: '-50%', y: '-50%' }}
          animate={inView ? { opacity: 1, scale: 1, x: '-50%', y: '-50%' } : {}}
          transition={{ duration: 0.8, delay: 0.2 + node.delay, ease: EASE }}
        >
          {/* Outer glow ring for center node */}
          {node.ring && (
            <motion.div
              className="absolute rounded-full border border-white/[0.08]"
              style={{ width: node.size * 5, height: node.size * 5 }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <motion.div
            className="rounded-full relative"
            style={{
              width: node.size * 2,
              height: node.size * 2,
              background: i === 0
                ? 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0.35))'
                : 'radial-gradient(circle, rgba(255,255,255,0.55), rgba(255,255,255,0.18))',
              boxShadow: i === 0
                ? '0 0 28px rgba(255,255,255,0.2), 0 0 56px rgba(255,255,255,0.08)'
                : '0 0 16px rgba(255,255,255,0.1)',
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
          />
          <motion.span
            className={`font-mono text-[10px] tracking-wide whitespace-nowrap mt-1.5 ${i === 0 ? 'text-white/75 font-semibold' : 'text-white/40'}`}
            animate={{ y: [0, -1.5, 0] }}
            transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
          >
            {node.label}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Gradient section divider ─── */

function SectionDivider() {
  return (
    <div className="relative h-px">
      <div className="absolute inset-0 bg-white/[0.06]" />
      <div
        className="absolute left-1/2 -translate-x-1/2 h-px w-[400px] max-w-[60%]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
      />
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans antialiased selection:bg-white/10 overflow-x-hidden">
      {/* Subtle noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[60] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* ── NAV ── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backdropFilter: 'blur(20px) saturate(1.4)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
        animate={{
          backgroundColor: scrolled ? 'rgba(9,9,11,0.95)' : 'rgba(9,9,11,0.6)',
        }}
        transition={{ duration: 0.3 }}
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
              className="group relative inline-flex items-center justify-center h-10 px-5 bg-white text-[#09090b] text-[12px] font-mono font-bold uppercase tracking-[0.06em] rounded-lg motion-safe:active:scale-[0.97] transition-all duration-150 hover:bg-white/90 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              <span className="relative">Get started</span>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative pt-36 md:pt-48 pb-24 md:pb-36 overflow-hidden">
        {/* Breathing primary glow */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(255,255,255,0.06), rgba(255,255,255,0.02) 50%, transparent 80%)' }}
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Secondary warm glow */}
        <motion.div
          className="absolute top-[10%] left-[40%] w-[500px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.02), transparent 70%)' }}
          animate={{ x: [0, 30, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative mx-auto max-w-[1200px] px-6 md:px-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30 mb-7"
          >
            Relational intelligence
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="text-[48px] md:text-[64px] lg:text-[76px] font-bold tracking-[-0.04em] leading-[1.0] mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/35">
              Clarity for hard
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/35">
              relationships.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="text-[18px] md:text-[20px] text-white/55 leading-[1.6] mb-10 max-w-lg mx-auto"
          >
            See patterns. Understand timing. Choose a calmer next step.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link
              href="/auth/signup"
              className="group relative inline-flex items-center justify-center h-13 px-8 bg-white text-[#09090b] text-[13px] font-mono font-bold uppercase tracking-[0.08em] rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.4)] motion-safe:active:scale-[0.97] transition-all duration-150 hover:bg-white/90 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              <span className="relative">Start free</span>
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
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <motion.div
            className="w-[1px] h-6 bg-gradient-to-b from-transparent to-white/15"
            animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <SectionDivider />
      <section>
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Relationship Map (dark card) */}
            <FadeIn>
              <SpotlightCard className="group bg-[#111113] border border-white/[0.06] rounded-2xl p-8 md:p-10 h-full flex flex-col overflow-hidden">
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
              </SpotlightCard>
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
                        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
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
      <SectionDivider />
      <section id="how-it-works">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32">
          <FadeIn>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/25 mb-4">How it works</p>
            <h2 className="text-[36px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-14">
              Three steps to clarity.
            </h2>
          </FadeIn>

          {/* Desktop connector line */}
          <div className="hidden md:block relative">
            <div className="absolute top-[52px] left-[16.67%] right-[16.67%] h-px">
              <div
                className="h-full w-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((card, i) => (
              <FadeIn key={card.step} delay={i * 0.12}>
                <SpotlightCard
                  className="group h-full border border-white/[0.06] p-7 md:p-8 rounded-2xl motion-safe:hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008))' }}
                >
                  <div className="relative flex items-center gap-3 mb-5">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full border border-white/[0.08] font-mono text-[13px] text-white/20">
                      {card.step}
                    </span>
                    {i < 2 && (
                      <span className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-2 h-px bg-white/[0.08]" />
                    )}
                  </div>
                  <h3 className="relative text-[17px] font-semibold text-white/90 mb-3">{card.title}</h3>
                  <p className="relative text-[15px] text-white/50 leading-[1.7]">{card.body}</p>
                </SpotlightCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <SectionDivider />
      <section>
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32">
          <FadeIn>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/25 mb-4">What you get</p>
            <h2 className="text-[36px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-12">
              Clear answers, not vague advice.
            </h2>
          </FadeIn>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {OUTCOMES.map((item) => (
              <motion.div
                key={item}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
                className="group flex items-start gap-3.5 border border-white/[0.06] bg-white/[0.02] p-6 rounded-2xl hover:border-white/[0.10] hover:bg-white/[0.035] transition-all duration-300"
              >
                <motion.div
                  className="mt-1 shrink-0"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                >
                  <Check className="w-4 h-4 text-white/30 group-hover:text-white/50 transition-colors duration-300" />
                </motion.div>
                <p className="text-[15px] text-white/55 leading-[1.6] group-hover:text-white/65 transition-colors duration-300">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <SectionDivider />
      <section id="pricing" className="relative">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03), transparent 70%)' }}
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
              <SpotlightCard
                className="group h-full border border-white/[0.06] p-7 md:p-8 rounded-2xl flex flex-col motion-safe:hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))' }}
              >
                <div className="mb-7">
                  <h3 className="text-[20px] font-semibold text-white/90">Solo</h3>
                  <p className="text-[13px] text-white/35 mt-1">For personal clarity</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-[36px] font-bold text-white tracking-tight">$19</span>
                    <span className="text-[14px] font-normal text-white/25">/ month</span>
                  </div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-6" />
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
              </SpotlightCard>
            </FadeIn>

            {/* Team */}
            <FadeIn delay={0.1}>
              <SpotlightCard
                className="group relative h-full p-7 md:p-8 rounded-2xl flex flex-col motion-safe:hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 0 60px rgba(255,255,255,0.03), 0 0 120px rgba(255,255,255,0.01)',
                }}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
                  initial={false}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.04) 55%, transparent 60%)',
                      backgroundSize: '200% 100%',
                    }}
                    animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
                  />
                </motion.div>
                <div className="absolute -top-3 right-6">
                  <span className="inline-block font-mono text-[9px] uppercase tracking-[0.15em] px-3 py-1 rounded-full font-bold text-black bg-white shadow-[0_0_16px_rgba(255,255,255,0.15)]">
                    Best value
                  </span>
                </div>
                <div className="relative mb-7">
                  <h3 className="text-[20px] font-semibold text-white/90">Team</h3>
                  <p className="text-[13px] text-white/35 mt-1">For family or close groups</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-[36px] font-bold text-white tracking-tight">$33</span>
                    <span className="text-[14px] font-normal text-white/25">/ month</span>
                  </div>
                </div>
                <div className="relative h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-6" />
                <ul className="relative space-y-3.5 text-[14px] text-white/50 leading-relaxed flex-1 mb-8">
                  {TEAM_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Check className="w-4 h-4 shrink-0 text-white/30" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className="relative inline-flex items-center justify-center h-12 w-full bg-white text-[#09090b] text-[13px] font-mono font-bold uppercase tracking-[0.08em] rounded-xl shadow-[0_0_24px_rgba(255,255,255,0.1)] motion-safe:active:scale-[0.97] transition-all duration-150 hover:bg-white/90"
                >
                  Start Team
                </Link>
              </SpotlightCard>
            </FadeIn>
          </div>
          <p className="text-[12px] text-white/20 text-center mt-8 font-mono tracking-wide">Upgrade anytime.</p>
        </div>
      </section>

      {/* ── TRUST ── */}
      <SectionDivider />
      <section>
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-28">
          <FadeIn className="text-center mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/25 mb-4">Trust</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[900px] mx-auto">
            {TRUST_ITEMS.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <SpotlightCard
                  className="group text-center border border-white/[0.06] rounded-2xl p-7 md:p-8 motion-safe:hover:-translate-y-0.5 hover:border-white/[0.10] transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.008))' }}
                >
                  <h3 className="text-[16px] font-semibold text-white/85 mb-2.5">{item.title}</h3>
                  <p className="text-[14px] text-white/45 leading-[1.7]">{item.body}</p>
                </SpotlightCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <SectionDivider />
      <section className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.035), transparent 55%)' }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
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
            <div className="relative inline-block">
              {/* Button glow */}
              <motion.div
                className="absolute -inset-3 rounded-2xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)' }}
                animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              <Link
                href="/auth/signup"
                className="relative inline-flex items-center justify-center h-13 px-10 bg-white text-[#09090b] text-[13px] font-mono font-bold uppercase tracking-[0.08em] rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.4)] motion-safe:active:scale-[0.97] transition-all duration-150 hover:bg-white/90"
              >
                Get started
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)' }} />
      <footer>
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
