'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

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

      {/* ════════ SECTION A — HERO ════════ */}
      <section className="max-w-[920px] mx-auto px-6 pt-28 pb-16 md:pt-44 md:pb-28 flex flex-col justify-center min-h-[85vh]">
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
            className="inline-flex items-center justify-center h-[52px] px-9 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:bg-white/90 transition-colors duration-200"
          >
            Create account
          </Link>
          <a
            href="#how-it-helps"
            onClick={scrollTo('how-it-helps')}
            className="inline-flex items-center justify-center h-[52px] px-9 border border-white/25 text-white/80 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/50 transition-all duration-200"
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

      {/* ════════ SECTION B — HOW IT HELPS ════════ */}
      <section id="how-it-helps" className="max-w-[920px] mx-auto px-6 py-20 md:py-24">
        <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-5">
          How it helps
        </p>
        <h2 className="text-[26px] md:text-[36px] font-normal tracking-[-0.015em] text-white mb-12 md:mb-14">
          Three things that shift the dynamic.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'See the pattern', body: 'Spot what keeps repeating — without blame or guesswork.' },
            { title: 'Choose better timing', body: 'Know when to speak, pause, or wait for a cleaner opening.' },
            { title: 'Speak without escalation', body: 'Get calmer wording and a clearer plan for the moment.' },
          ].map((card) => (
            <div
              key={card.title}
              className="border border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05] transition-all duration-200 p-7 md:p-8 rounded-xl"
            >
              <h3 className="text-[18px] md:text-[20px] font-medium text-white mb-3">{card.title}</h3>
              <p className="text-[15px] md:text-[16px] text-white/65 leading-[1.6]">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ SECTION C — PRODUCT PREVIEW ════════ */}
      <section className="max-w-[920px] mx-auto px-6 py-20 md:py-24">
        <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-5">
          Dashboard
        </p>
        <div className="border border-white/[0.08] bg-white/[0.03] rounded-xl p-7 md:p-10">
          <h2 className="text-[22px] md:text-[28px] font-normal tracking-[-0.01em] text-white mb-2">
            Today&apos;s overview
          </h2>
          <p className="text-[15px] md:text-[16px] text-white/55 leading-[1.6] mb-8">
            A quick read on what&apos;s easier today — and what needs care.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Today', value: 'pressure window' },
              { label: 'People', value: 'who needs space / who needs clarity' },
              { label: 'Ask', value: 'go deeper in chat' },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-4 border border-white/[0.06] bg-white/[0.02] rounded-lg px-5 py-4"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50 w-16 shrink-0">
                  {row.label}
                </span>
                <div className="h-[1px] flex-1 bg-white/[0.08]" />
                <span className="text-[14px] md:text-[15px] text-white/55">{row.value}</span>
              </div>
            ))}
          </div>
          <p className="text-[13px] md:text-[14px] text-white/40 mt-7">
            You can keep it simple — or add people for deeper context.
          </p>
        </div>
      </section>

      {/* ════════ SECTION D — PRICING ════════ */}
      <section className="max-w-[920px] mx-auto px-6 py-20 md:py-24">
        <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-5">
          Pricing
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Solo */}
          <div className="border border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05] transition-all duration-200 p-7 md:p-8 rounded-xl flex flex-col">
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
              className="inline-flex items-center justify-center h-[48px] px-6 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:bg-white/90 transition-colors duration-200"
            >
              Choose Solo
            </Link>
          </div>

          {/* Plus */}
          <div className="border border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05] transition-all duration-200 p-7 md:p-8 rounded-xl flex flex-col">
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
              className="inline-flex items-center justify-center h-[48px] px-6 border border-white/25 text-white/85 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/50 transition-all duration-200"
            >
              Choose Plus
            </Link>
          </div>
        </div>
        <p className="text-[14px] text-white/40 text-center mt-8">
          Upgrade anytime. Cancel anytime.
        </p>
      </section>

      {/* ════════ SECTION E — TRUST & PRIVACY ════════ */}
      <section className="max-w-[920px] mx-auto px-6 py-20 md:py-24">
        <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-5">
          Privacy
        </p>
        <div className="flex flex-col gap-3">
          <p className="text-[20px] md:text-[24px] text-white font-normal">Private by default.</p>
          <p className="text-[20px] md:text-[24px] text-white font-normal">Delete anytime.</p>
          <p className="text-[15px] md:text-[16px] text-white/45 mt-3">Your account data stays yours.</p>
        </div>
      </section>

      {/* ════════ SECTION F — FINAL CTA ════════ */}
      <section className="max-w-[920px] mx-auto px-6 py-20 md:py-32">
        <h2 className="text-[26px] md:text-[36px] font-normal tracking-[-0.015em] text-white mb-4">
          Start with one relationship.
        </h2>
        <p className="text-[17px] md:text-[20px] text-white/65 mb-12 leading-[1.6]">
          Create an account and get a clear next step today.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center h-[52px] px-9 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:bg-white/90 transition-colors duration-200"
          >
            Create account
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center h-[52px] px-9 border border-white/25 text-white/80 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/50 transition-all duration-200"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="max-w-[920px] mx-auto px-6 pb-16 pt-10 border-t border-white/[0.08] flex justify-between items-center flex-wrap gap-4">
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
