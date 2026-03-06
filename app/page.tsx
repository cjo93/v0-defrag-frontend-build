'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { RelationshipDemo } from "./components/landing/RelationshipDemo";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import SystemMapHero from './components/landing/SystemMapHero';
import { InsightTiles } from './components/landing/InsightTiles';


/* ─── Data ────────────────────────────────────────────────────── */


const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Enter your birth data',
    body: 'Date, time (optional), and location. Takes under a minute. If you don\'t know your birth time, you can still start with a partial map.',
  },
  {
    step: '02',
    title: 'Map your people',
    body: 'Add the relationships that matter \u2014 family, partners, anyone. Invite them to share their own data or add it yourself.',
  },
  {
    step: '03',
    title: 'Get real answers',
    body: 'Ask DEFRAG anything. You\u2019ll get a structured breakdown: what\u2019s happening, why it keeps happening, and what to do next.',
  },
];

const ENGINE_STEPS = [
  {
    title: 'Birth data',
    body: 'Date, time (optional), and location generate a personal pattern map — how you decide, process emotion, communicate, and recover.',
  },
  {
    title: 'Relationship overlay',
    body: 'Add the people that matter. DEFRAG compares patterns to show where conversations naturally tighten or open.',
  },
  {
    title: 'Repeat detection',
    body: 'DEFRAG flags what keeps looping — the same trigger, the same sequence, the same outcome — even when the topic changes.',
  },
  {
    title: 'AI translation',
    body: 'Complex structure becomes plain language: what’s happening, why it repeats, and what usually helps.',
  },
  {
    title: 'Clear guidance',
    body: 'One next step you can take now, plus a clean line to say that keeps the conversation open.',
  },
];


const VALUE_PROPS = [
  {
    title: 'Stop guessing why it hurts',
    body: 'DEFRAG shows the pattern behind conflict — what sets it off, how it escalates, and what usually helps.',
  },
  {
    title: 'Answers, not more questions',
    body: 'Every response is structured: what\u2019s happening, why it repeats, and one concrete thing you can do right now.',
  },
  {
    title: 'See your entire relational world',
    body: 'A living map of your key relationships — where things are smooth, where they\'re strained, and where to focus today.',
  },
  {
    title: 'Know when to speak and when to wait',
    body: 'Timing suggestions help you choose better windows for hard conversations — so you\'re not forcing it at the worst moment.',
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

function RelationalEngineSection() {
  return (
    <section className="relative">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[520px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.035), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 py-24 md:py-32">
        <FadeIn className="text-center mb-14">
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/25 mb-4 font-medium">What DEFRAG uses</p>
          <h2 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-3">
            From human data<br className="hidden md:block" /> to clear answers.
          </h2>
          <p className="text-[16px] text-white/35 max-w-[720px] mx-auto leading-[1.7]">
            DEFRAG is a platform: it builds a personal pattern map, overlays relationships, and turns what repeats into guidance you can use.
          </p>
        </FadeIn>

        {/* Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          {ENGINE_STEPS.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.08}>
              <SpotlightCard
                className="group h-full border border-white/[0.06] rounded-2xl p-7 md:p-7 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.008))' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-white/25 font-medium">Step {String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[11px] text-white/20">{i < ENGINE_STEPS.length - 1 ? '→' : '•'}</span>
                </div>

                <h3 className="text-[16px] font-semibold text-white/85 mb-2.5">{s.title}</h3>
                <p className="text-[14px] text-white/40 leading-[1.75]">{s.body}</p>

                {/* subtle bottom rule */}
                <div className="mt-6 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
              </SpotlightCard>
            </FadeIn>
          ))}
        </div>

        {/* Small clarity note */}
        <FadeIn delay={0.25}>
          <div className="mt-10 text-center text-[12px] text-white/20 tracking-wide">
            Private by default. You control what’s stored, shared, and deleted.
          </div>
        </FadeIn>
      </div>
    </section>
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
    <main className="min-h-screen font-sans antialiased overflow-x-hidden" style={{ background: 'var(--bg-premium-gradient)', color: 'var(--text-primary)' }}>
      {/* Subtle noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[60] opacity-[0.03]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />

      {/* ── NAV ── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}
        animate={{
          backgroundColor: scrolled ? 'rgba(15,15,16,0.85)' : 'rgba(15,15,16,0.5)',
        }}
      >
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 h-[64px] flex items-center justify-between">
          <Link href="/" className="text-[14px] font-[700] tracking-[0.2em]" style={{ color: 'var(--accent-cream)' }}>
            DEFRAG
          </Link>
          <div className="flex items-center gap-[12px]">
            <Link
              href="/auth/login"
              className="inline-flex items-center h-[40px] px-4 text-[13px] text-white/50 hover:text-white/90 transition-colors duration-200 tracking-[0.02em] font-[500]"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="group relative inline-flex items-center justify-center h-[40px] px-6 bg-[var(--accent-cream)] text-[#18181b] text-[12px] font-[600] uppercase tracking-[0.03em] rounded-[8px] shadow-[0_0_24px_rgba(248,246,242,0.12)] motion-safe:active:scale-[0.97] transition-all duration-150 hover:bg-[var(--accent-cream-dim)] overflow-hidden border border-[var(--panel-border)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-cream)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              <span className="relative">GET STARTED</span>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative pt-32 md:pt-44 pb-20 md:pb-32 overflow-hidden">


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
            className="text-[44px] sm:text-[52px] md:text-[72px] lg:text-[84px] font-semibold md:font-bold tracking-[-0.02em] leading-[1.05] md:leading-tight mb-7"
            style={{ color: 'var(--text-primary)' }}
          >
            <span className="block">UNDERSTAND</span>
            <span className="block">WHY IT</span>
            <span className="block">KEEPS HAPPENING.</span>
          </motion.h1>

                    <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="text-[18px] md:text-[20px] leading-[1.65] mb-11 max-w-[520px] mx-auto text-neutral-300"
          >
            See the system behind your relationships.<br />
            DEFRAG shows you what’s actually happening — and where change becomes possible.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
            className="flex flex-col sm:flex-row gap-[12px] justify-center mt-[40px] mb-9"
          >
            <Link
              href="/auth/signup"
              className="group relative inline-flex items-center justify-center h-[56px] px-9 bg-[var(--accent-cream)] text-[#18181b] text-[13px] font-[600] uppercase tracking-[0.03em] rounded-[14px] shadow-[0_0_50px_rgba(248,246,242,0.12),0_4px_24px_rgba(0,0,0,0.4)] motion-safe:active:scale-[0.97] transition-all duration-150 hover:bg-[var(--accent-cream-dim)] overflow-hidden border border-[var(--panel-border)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-cream)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              <span className="relative">START FREE — NO CARD REQUIRED</span>
            </Link>
            <button
              onClick={() => document.getElementById('see-output')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center h-[56px] px-9 border border-white/[0.1] text-white/50 text-[13px] font-[600] uppercase tracking-[0.03em] rounded-[14px] hover:text-white/90 hover:border-white/[0.2] hover:bg-white/[0.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] motion-safe:active:scale-[0.97] transition-all duration-200"
            >
              SEE WHAT DEFRAG OUTPUTS
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

          {/* System Map Hero Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.0, ease: EASE }}
          >
            <SystemMapHero />
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

      {/* ── EXAMPLE OUTPUT ── */}
      <SectionDivider />
      <section className="py-24 md:py-32 overflow-hidden px-6 md:px-10">
        <div className="mx-auto max-w-[1200px] mb-12 text-center md:text-left">
          <FadeIn>
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/30 mb-4 font-semibold">
              EXAMPLE OUTPUT
            </p>
            <h2 className="text-[28px] md:text-[36px] font-bold tracking-[-0.03em] leading-tight text-white">
              What Defrag gives you when the pattern is clear.
            </h2>
          </FadeIn>
        </div>
        <InsightTiles />
      </section>


      {/* ── RELATIONAL ENGINE ── */}
      <SectionDivider />
      <RelationalEngineSection />

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
              Not generic advice.<br className="hidden md:block" /> Clear guidance.
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
