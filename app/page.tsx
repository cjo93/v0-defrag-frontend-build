'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import HowDefragWorksExplainer from '@/components/HowDefragWorksExplainer';

/* ─── Data ────────────────────────────────────────────────────── */

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Enter your birth data',
    body: 'Date, time, and location. Takes under a minute. If you don\u2019t know your birth time, we estimate accurately.',
  },
  {
    step: '02',
    title: 'Map your people',
    body: 'Add the relationships that matter \u2014 family, partners, anyone. Invite them to share their own data or add it yourself.',
  },
  {
    step: '03',
    title: 'Get real answers',
    body: 'Ask DEFRAG anything. You\u2019ll get a structured breakdown: what\u2019s happening, why it keeps happening, and exactly what to do next.',
  },
];

const EXAMPLE_OUTPUTS = [
  {
    context: 'You asked: "Why does every conversation with my mom turn into a fight?"',
    sections: [
      {
        heading: 'The pattern',
        body: 'Your mom reads emotional space as rejection. When you pull back to protect your energy, she escalates \u2014 not because she\u2019s ignoring your boundary, but because distance triggers her deepest fear.',
      },
      {
        heading: 'Why it cycles',
        body: 'This intensifies during transitions \u2014 holidays, moves, life changes. Her need for closeness spikes exactly when your need for space does. Neither of you is wrong. The timing is the problem.',
      },
      {
        heading: 'Your next move',
        body: '"I need a few days to reset \u2014 it\u2019s not about you." Short. Direct. Before the tension builds. Timing beats wording every time.',
      },
    ],
  },
];

const VALUE_PROPS = [
  {
    title: 'Stop guessing why it hurts',
    body: 'DEFRAG shows you the invisible mechanics behind conflict \u2014 the patterns, triggers, and timing that keep relationships stuck.',
  },
  {
    title: 'Answers, not more questions',
    body: 'Every response is structured: what\u2019s happening, why it repeats, and one concrete thing you can do right now.',
  },
  {
    title: 'See your entire relational world',
    body: 'A living map of every key relationship \u2014 who\u2019s in tension, who\u2019s aligned, and where to focus your energy today.',
  },
  {
    title: 'Know when to speak and when to wait',
    body: 'Timing recommendations based on relational dynamics tell you the best window to have hard conversations.',
  },
];

const TRUST_ITEMS = [
  { title: 'Private by default', body: 'Your data is never shared, sold, or visible to other users. Period.' },
  { title: 'You control sharing', body: 'Invite links share only what you allow. Nothing is exposed without explicit consent.' },
  { title: 'Delete everything, anytime', body: 'One click removes your account and every byte of associated data. Permanently.' },
];

const FREE_FEATURES = ['Personal natal chart', 'Limited relationship chat', 'Basic daily insight'];
const SOLO_FEATURES = ['Unlimited relationship chat', 'Full daily briefings', 'Saved conversation history', 'Timing recommendations'];
const TEAM_FEATURES = ['Everything in Solo', 'Add people + invite links', 'Full relationship map', 'Group dynamics + deeper context'];

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

/* ─── Constellation Map ─── */

function ConstellationMap() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const nodes = [
    { label: 'You', x: 50, y: 42, size: 14, delay: 0, state: 'center' as const },
    { label: 'Mom', x: 20, y: 18, size: 8, delay: 0.2, state: 'tension' as const },
    { label: 'Partner', x: 80, y: 22, size: 9, delay: 0.35, state: 'aligned' as const },
    { label: 'Dad', x: 28, y: 72, size: 7, delay: 0.5, state: 'neutral' as const },
    { label: 'Sister', x: 72, y: 68, size: 7.5, delay: 0.65, state: 'aligned' as const },
    { label: 'Best Friend', x: 12, y: 48, size: 6, delay: 0.8, state: 'aligned' as const },
    { label: 'Coworker', x: 88, y: 50, size: 5.5, delay: 0.95, state: 'tension' as const },
    { label: 'Ex', x: 40, y: 85, size: 5, delay: 1.1, state: 'tension' as const },
    { label: 'Boss', x: 65, y: 88, size: 5, delay: 1.2, state: 'neutral' as const },
  ];

  const edges = [
    { from: 0, to: 1, strength: 0.25, state: 'tension' as const },
    { from: 0, to: 2, strength: 0.3, state: 'aligned' as const },
    { from: 0, to: 3, strength: 0.15, state: 'neutral' as const },
    { from: 0, to: 4, strength: 0.2, state: 'aligned' as const },
    { from: 0, to: 5, strength: 0.18, state: 'aligned' as const },
    { from: 0, to: 6, strength: 0.12, state: 'tension' as const },
    { from: 0, to: 7, strength: 0.08, state: 'tension' as const },
    { from: 0, to: 8, strength: 0.1, state: 'neutral' as const },
    { from: 1, to: 3, strength: 0.1, state: 'neutral' as const },
    { from: 1, to: 4, strength: 0.08, state: 'neutral' as const },
    { from: 2, to: 4, strength: 0.06, state: 'aligned' as const },
    { from: 3, to: 7, strength: 0.05, state: 'tension' as const },
  ];

  const stateOpacity = { center: 1, aligned: 0.45, tension: 0.3, neutral: 0.2 };

  return (
    <div ref={ref} className="relative w-full h-[320px] md:h-[380px]">
      {/* Layered orbital rings */}
      {[160, 240, 340].map((size, ri) => (
        <motion.div
          key={size}
          className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full border border-white/[0.04]"
          style={{ width: size, height: size }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.2 + ri * 0.15, ease: EASE }}
        />
      ))}

      {/* Ambient center glow */}
      <motion.div
        className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.07), transparent 60%)' }}
        animate={inView ? { opacity: [0.4, 0.75, 0.4], scale: [0.95, 1.08, 0.95] } : {}}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Edges with animated pulse */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="edgeAligned" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="50%" stopColor="white" stopOpacity="0.08" />
            <stop offset="100%" stopColor="white" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="edgeTension" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.12" />
            <stop offset="50%" stopColor="white" stopOpacity="0.04" />
            <stop offset="100%" stopColor="white" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        {edges.map((edge, i) => {
          const a = nodes[edge.from];
          const b = nodes[edge.to];
          const isAligned = edge.state === 'aligned';
          return (
            <motion.line
              key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={isAligned ? 'url(#edgeAligned)' : 'url(#edgeTension)'}
              strokeWidth={isAligned ? '0.25' : '0.15'}
              strokeDasharray={edge.state === 'tension' ? '1 1.5' : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: edge.strength } : {}}
              transition={{ duration: 1.4, delay: 0.3 + i * 0.08, ease: EASE }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => {
        const isCenter = node.state === 'center';
        const isTension = node.state === 'tension';
        return (
          <motion.div
            key={node.label}
            className="absolute flex flex-col items-center"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ opacity: 0, scale: 0.2, x: '-50%', y: '-50%' }}
            animate={inView ? { opacity: 1, scale: 1, x: '-50%', y: '-50%' } : {}}
            transition={{ duration: 0.9, delay: 0.15 + node.delay, ease: EASE }}
          >
            {/* Pulse ring for center */}
            {isCenter && (
              <motion.div
                className="absolute rounded-full border border-white/[0.1]"
                style={{ width: node.size * 5.5, height: node.size * 5.5 }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.08, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            {/* Tension indicator ring */}
            {isTension && (
              <motion.div
                className="absolute rounded-full border border-white/[0.06]"
                style={{ width: node.size * 4, height: node.size * 4 }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.05, 0.15] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
              />
            )}
            <motion.div
              className="rounded-full relative"
              style={{
                width: node.size * 2,
                height: node.size * 2,
                background: isCenter
                  ? 'radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0.4))'
                  : isTension
                    ? 'radial-gradient(circle, rgba(255,255,255,0.4), rgba(255,255,255,0.12))'
                    : 'radial-gradient(circle, rgba(255,255,255,0.6), rgba(255,255,255,0.2))',
                boxShadow: isCenter
                  ? '0 0 32px rgba(255,255,255,0.25), 0 0 64px rgba(255,255,255,0.1)'
                  : `0 0 ${isTension ? 12 : 20}px rgba(255,255,255,${isTension ? 0.06 : 0.12})`,
              }}
              animate={{ scale: [1, isCenter ? 1.12 : 1.08, 1] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
            />
            <motion.span
              className={`text-[10px] tracking-wide whitespace-nowrap mt-1.5 ${isCenter ? 'text-white/80 font-semibold' : isTension ? 'text-white/25' : 'text-white/40'}`}
              style={{ opacity: stateOpacity[node.state] }}
              animate={{ y: [0, -1.5, 0] }}
              transition={{ duration: 4.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
            >
              {node.label}
            </motion.span>
          </motion.div>
        );
      })}

      {/* Legend */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-5"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.6, ease: EASE }}
      >
        <span className="flex items-center gap-1.5 text-[10px] text-white/25">
          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
          Aligned
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-white/25">
          <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
          Tension
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-white/25">
          <span className="w-1.5 h-1.5 rounded-full bg-white/15 border border-white/10" />
          Neutral
        </span>
      </motion.div>
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
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

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
          <Link href="/" className="text-[14px] font-bold tracking-[0.2em] text-white/90 uppercase">
            DEFRAG
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex items-center h-10 px-4 text-[13px] text-white/35 hover:text-white/60 transition-colors duration-200 tracking-wide"
            >
              Pricing
            </button>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex items-center h-10 px-4 text-[13px] text-white/35 hover:text-white/60 transition-colors duration-200 tracking-wide"
            >
              How it works
            </button>
            <Link
              href="/auth/login"
              className="inline-flex items-center h-10 px-4 text-[13px] text-white/35 hover:text-white/60 transition-colors duration-200 tracking-wide"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="group relative inline-flex items-center justify-center h-10 px-5 bg-white text-[#09090b] text-[12px] font-bold uppercase tracking-[0.06em] rounded-lg motion-safe:active:scale-[0.97] transition-all duration-150 hover:bg-white/90 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              <span className="relative">Get started</span>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative pt-32 md:pt-44 pb-20 md:pb-32 overflow-hidden">
        {/* Dramatic radial glow */}
        <motion.div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 40%, transparent 70%)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Floating accent glow */}
        <motion.div
          className="absolute top-[15%] left-[35%] w-[600px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.03), transparent 65%)' }}
          animate={{ x: [0, 40, 0], y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative mx-auto max-w-[1200px] px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="inline-flex items-center gap-2 border border-white/[0.08] rounded-full px-4 py-1.5 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
            <span className="text-[12px] uppercase tracking-[0.2em] text-white/35">Relational intelligence platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            className="text-[46px] md:text-[68px] lg:text-[82px] font-bold tracking-[-0.04em] leading-[0.95] mb-7"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/30">
              Finally understand
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/25">
              why it keeps happening.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="text-[18px] md:text-[21px] text-white/50 leading-[1.65] mb-11 max-w-[560px] mx-auto"
          >
            DEFRAG maps the invisible dynamics behind your hardest relationships
            and tells you exactly what to do next.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-9"
          >
            <Link
              href="/auth/signup"
              className="group relative inline-flex items-center justify-center h-14 px-9 bg-white text-[#09090b] text-[13px] font-bold uppercase tracking-[0.08em] rounded-xl shadow-[0_0_50px_rgba(255,255,255,0.1),0_4px_24px_rgba(0,0,0,0.4)] motion-safe:active:scale-[0.97] transition-all duration-150 hover:bg-white/90 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              <span className="relative">Start free &mdash; no card required</span>
            </Link>
            <button
              onClick={() => document.getElementById('see-output')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center h-14 px-9 border border-white/[0.10] text-white/40 text-[13px] font-bold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/20 hover:bg-white/[0.03] motion-safe:active:scale-[0.97] transition-all duration-200"
            >
              See what DEFRAG outputs
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.85 }}
            className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[12px] text-white/20"
          >
            <span>Private by default</span>
            <span className="text-white/8">&middot;</span>
            <span>Delete anytime</span>
            <span className="text-white/8">&middot;</span>
            <span>No social feed</span>
            <span className="text-white/8">&middot;</span>
            <span>Free tier available</span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <motion.div
            className="w-[1px] h-7 bg-gradient-to-b from-transparent to-white/15"
            animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
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
                <span className="text-[11px] uppercase tracking-[0.25em] text-white/30 mb-5 font-medium">Your relationship map</span>
                <h2 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-none text-white mb-4">
                  See every dynamic at a glance.
                </h2>
                <p className="text-[15px] text-white/50 leading-[1.75] mb-6 max-w-sm">
                  A living constellation of your relationships. Watch tension and alignment shift in real time. Know where to focus your energy.
                </p>
                <div className="mt-auto">
                  <ConstellationMap />
                </div>
              </SpotlightCard>
            </FadeIn>

            {/* Chat output (light card) */}
            <FadeIn delay={0.1}>
              <div id="see-output" className="relative bg-[#f0eeeb] border border-white/[0.06] rounded-2xl p-8 md:p-10 h-full flex flex-col overflow-hidden">
                <span className="text-[11px] uppercase tracking-[0.25em] text-black/30 mb-5 font-medium">Real DEFRAG output</span>
                <h2 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-none text-[#09090b] mb-2">
                  Ask anything.
                </h2>
                <p className="text-[14px] text-black/40 leading-[1.6] mb-5 max-w-sm italic">
                  &ldquo;Why does every conversation with my mom turn into a fight?&rdquo;
                </p>
                <motion.div
                  className="mt-auto space-y-3"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                >
                  {EXAMPLE_OUTPUTS[0].sections.map((block, i) => (
                    <motion.div
                      key={block.heading}
                      variants={{
                        hidden: { opacity: 0, y: 14 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
                      }}
                      className={`rounded-xl p-5 ${i === 0 ? 'bg-[#e8e5e0] text-[#09090b]' : 'bg-[#09090b] text-white'}`}
                    >
                      <span className={`text-[11px] uppercase tracking-[0.2em] font-semibold ${i === 0 ? 'text-black/35' : 'text-white/30'} block mb-2`}>
                        {block.heading}
                      </span>
                      <p className={`text-[14px] leading-[1.7] ${i === 0 ? 'text-[#09090b]/80' : 'text-white/75'}`}>
                        {block.body}
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
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/25 mb-4 font-medium">How it works</p>
            <h2 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-14">
              Three steps. Real clarity.
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
                    <span className="flex items-center justify-center w-10 h-10 rounded-full border border-white/[0.08] text-[13px] text-white/25 font-semibold">
                      {card.step}
                    </span>
                    {i < 2 && (
                      <span className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-2 h-px bg-white/[0.08]" />
                    )}
                  </div>
                  <h3 className="relative text-[17px] font-semibold text-white/90 mb-3">{card.title}</h3>
                  <p className="relative text-[15px] text-white/45 leading-[1.75]">{card.body}</p>
                </SpotlightCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <SectionDivider />
      <section>
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32">
          <FadeIn>
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/25 mb-4 font-medium">What DEFRAG does for you</p>
            <h2 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-12">
              Not therapy. Not horoscopes.<br className="hidden md:block" /> Precision.
            </h2>
          </FadeIn>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {VALUE_PROPS.map((item) => (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
                className="group border border-white/[0.06] bg-white/[0.02] p-7 rounded-2xl hover:border-white/[0.10] hover:bg-white/[0.035] transition-all duration-300"
              >
                <h3 className="text-[16px] font-semibold text-white/85 mb-2.5">{item.title}</h3>
                <p className="text-[15px] text-white/45 leading-[1.75]">{item.body}</p>
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
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/25 mb-4 font-medium">Pricing</p>
            <h2 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-3">
              Start free. Upgrade when you&rsquo;re ready.
            </h2>
            <p className="text-[16px] text-white/35 max-w-md mx-auto">No credit card required. Cancel paid plans anytime.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[960px] mx-auto">
            {/* Free */}
            <FadeIn>
              <SpotlightCard
                className="group h-full border border-white/[0.06] p-7 md:p-8 rounded-2xl flex flex-col motion-safe:hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.008))' }}
              >
                <div className="mb-7">
                  <h3 className="text-[20px] font-semibold text-white/85">Free</h3>
                  <p className="text-[13px] text-white/30 mt-1">See what DEFRAG can do</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-[36px] font-bold text-white tracking-tight">$0</span>
                    <span className="text-[14px] font-normal text-white/20">forever</span>
                  </div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-6" />
                <ul className="space-y-3.5 text-[14px] text-white/45 leading-relaxed flex-1 mb-8">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Check className="w-4 h-4 shrink-0 text-white/25" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center h-12 w-full border border-white/[0.10] text-white/55 text-[13px] font-bold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/20 hover:bg-white/[0.04] motion-safe:active:scale-[0.97] transition-all duration-150"
                >
                  Get started free
                </Link>
              </SpotlightCard>
            </FadeIn>

            {/* Solo */}
            <FadeIn delay={0.08}>
              <SpotlightCard
                className="group h-full border border-white/[0.06] p-7 md:p-8 rounded-2xl flex flex-col motion-safe:hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))' }}
              >
                <div className="mb-7">
                  <h3 className="text-[20px] font-semibold text-white/90">Solo</h3>
                  <p className="text-[13px] text-white/35 mt-1">Full personal clarity</p>
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
                  className="inline-flex items-center justify-center h-12 w-full border border-white/[0.10] text-white/65 text-[13px] font-bold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/20 hover:bg-white/[0.04] motion-safe:active:scale-[0.97] transition-all duration-150"
                >
                  Start Solo
                </Link>
              </SpotlightCard>
            </FadeIn>

            {/* Team */}
            <FadeIn delay={0.16}>
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
                  <span className="inline-block text-[9px] uppercase tracking-[0.15em] px-3 py-1 rounded-full font-bold text-black bg-white shadow-[0_0_16px_rgba(255,255,255,0.15)]">
                    Best value
                  </span>
                </div>
                <div className="relative mb-7">
                  <h3 className="text-[20px] font-semibold text-white/90">Team</h3>
                  <p className="text-[13px] text-white/35 mt-1">For family + close groups</p>
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
                  className="relative inline-flex items-center justify-center h-12 w-full bg-white text-[#09090b] text-[13px] font-bold uppercase tracking-[0.08em] rounded-xl shadow-[0_0_24px_rgba(255,255,255,0.1)] motion-safe:active:scale-[0.97] transition-all duration-150 hover:bg-white/90"
                >
                  Start Team
                </Link>
              </SpotlightCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <SectionDivider />
      <section>
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-28">
          <FadeIn className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/25 mb-4 font-medium">Built on trust</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[900px] mx-auto">
            {TRUST_ITEMS.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <SpotlightCard
                  className="group text-center border border-white/[0.06] rounded-2xl p-7 md:p-8 motion-safe:hover:-translate-y-0.5 hover:border-white/[0.10] transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.008))' }}
                >
                  <h3 className="text-[16px] font-semibold text-white/85 mb-2.5">{item.title}</h3>
                  <p className="text-[14px] text-white/40 leading-[1.75]">{item.body}</p>
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
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.04), transparent 55%)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32 text-center">
          <FadeIn>
            <h2 className="text-[36px] md:text-[52px] font-bold tracking-[-0.03em] leading-[1.0] mb-5">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/45">
                Your relationships<br className="hidden md:block" /> deserve better than guessing.
              </span>
            </h2>
            <p className="text-[17px] text-white/40 mb-10 max-w-lg mx-auto leading-[1.65]">
              Start for free. See what DEFRAG reveals about the patterns you&rsquo;ve been living inside.
            </p>
            <div className="relative inline-block">
              {/* Button glow */}
              <motion.div
                className="absolute -inset-3 rounded-2xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)' }}
                animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <Link
                href="/auth/signup"
                className="relative inline-flex items-center justify-center h-14 px-10 bg-white text-[#09090b] text-[13px] font-bold uppercase tracking-[0.08em] rounded-xl shadow-[0_0_50px_rgba(255,255,255,0.1),0_4px_24px_rgba(0,0,0,0.4)] motion-safe:active:scale-[0.97] transition-all duration-150 hover:bg-white/90"
              >
                Get started free
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)' }} />
      <footer>
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <span className="text-[12px] tracking-[0.15em] text-white/15 uppercase font-medium">
              DEFRAG &copy; {new Date().getFullYear()}
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/about" className="text-[12px] tracking-[0.1em] text-white/20 uppercase hover:text-white/40 transition-colors duration-200 py-1">
                About
              </Link>
              <Link href="/why" className="text-[12px] tracking-[0.1em] text-white/20 uppercase hover:text-white/40 transition-colors duration-200 py-1">
                Why DEFRAG
              </Link>
              <Link href="/principles" className="text-[12px] tracking-[0.1em] text-white/20 uppercase hover:text-white/40 transition-colors duration-200 py-1">
                Principles
              </Link>
              <Link href="/terms" className="text-[12px] tracking-[0.1em] text-white/20 uppercase hover:text-white/40 transition-colors duration-200 py-1">
                Terms
              </Link>
              <Link href="/contact" className="text-[12px] tracking-[0.1em] text-white/20 uppercase hover:text-white/40 transition-colors duration-200 py-1">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
