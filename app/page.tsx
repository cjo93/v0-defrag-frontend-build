'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { RelationshipMapPreview } from '@/components/landing/relationship-map-preview';
import { DashboardPreview } from '@/components/landing/dashboard-preview';
import { ChatPreview } from '@/components/landing/chat-preview';

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  return (
    <main className="min-h-screen text-white font-sans antialiased">

      {/* ── HERO ── */}
      <section className="mx-auto max-w-[1100px] px-6 pt-32 pb-24 flex flex-col justify-center min-h-[80vh]">
        <h1 className="text-[34px] md:text-[48px] font-semibold tracking-[-0.02em] leading-[1.1] text-white mb-5">
          DEFRAG
        </h1>
        <p className="text-[20px] text-white/70 leading-[1.5] max-w-[480px] mb-10">
          Understand the patterns shaping your relationships.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center h-[48px] px-8 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm active:scale-[0.98] transition-all duration-200 w-fit"
        >
          Open Dashboard
        </Link>
      </section>

      {/* ── RELATIONSHIP MAP PREVIEW ── */}
      <section className="mx-auto max-w-[1100px] px-6 py-20">
        <h2 className="section-title text-white mb-3">See how people connect.</h2>
        <p className="body-text mb-8 max-w-[480px]">Map the people who matter and track relational dynamics over time.</p>
        <RelationshipMapPreview />
      </section>

      {/* ── PLATFORM EXPLANATION ── */}
      <section className="mx-auto max-w-[1100px] px-6 py-20">
        <h2 className="section-title text-white mb-10">Three things that change the dynamic.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'See the pattern', body: 'Spot what keeps repeating — without blame.' },
            { title: 'Choose better timing', body: 'Know when to speak or wait for a cleaner opening.' },
            { title: 'Speak without escalation', body: 'Get calmer wording for difficult moments.' },
          ].map((card) => (
            <div
              key={card.title}
              className="border border-white/10 bg-white/[0.02] p-6 rounded-sm hover:border-white/20 hover:-translate-y-[1px] transition-all duration-200"
            >
              <h3 className="text-[16px] font-medium text-white mb-2">{card.title}</h3>
              <p className="text-[14px] text-white/65 leading-[1.6]">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section className="mx-auto max-w-[1100px] px-6 py-20">
        <h2 className="section-title text-white mb-3">Daily overview at a glance.</h2>
        <p className="body-text mb-8 max-w-[480px]">Relational states, people, and what needs attention today.</p>
        <DashboardPreview />
      </section>

      {/* ── CHAT PREVIEW ── */}
      <section className="mx-auto max-w-[1100px] px-6 py-20">
        <h2 className="section-title text-white mb-3">Ask anything about a relationship.</h2>
        <p className="body-text mb-8 max-w-[480px]">Calm, clear guidance — never blame, never escalation.</p>
        <ChatPreview />
      </section>

      {/* ── PRICING ── */}
      <section className="mx-auto max-w-[1100px] px-6 py-20">
        <h2 className="section-title text-white mb-10">Simple, transparent plans.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-white/10 bg-white/[0.02] p-6 rounded-sm flex flex-col hover:border-white/20 hover:-translate-y-[1px] transition-all duration-200">
            <h3 className="text-[20px] font-medium text-white mb-2">Solo</h3>
            <p className="text-[28px] font-normal text-white mb-5">$19<span className="text-[14px] text-white/45 ml-1">/ month</span></p>
            <ul className="flex flex-col gap-2 text-[14px] text-white/65 mb-8 flex-1">
              <li>Personal dashboard</li>
              <li>Relationship Q&amp;A</li>
              <li>Saved history</li>
            </ul>
            <Link href="/auth/login" className="inline-flex items-center justify-center h-[44px] px-6 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm active:scale-[0.98] transition-all duration-200">
              Choose Solo
            </Link>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-6 rounded-sm flex flex-col hover:border-white/20 hover:-translate-y-[1px] transition-all duration-200">
            <h3 className="text-[20px] font-medium text-white mb-2">Team</h3>
            <p className="text-[28px] font-normal text-white mb-5">$33<span className="text-[14px] text-white/45 ml-1">/ month</span></p>
            <ul className="flex flex-col gap-2 text-[14px] text-white/65 mb-8 flex-1">
              <li>Add family or close relationships</li>
              <li>Compare dynamics across people</li>
              <li>Deeper context in chat</li>
            </ul>
            <Link href="/auth/login" className="inline-flex items-center justify-center h-[44px] px-6 border border-white/25 text-white/80 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:text-white hover:border-white/50 active:scale-[0.98] transition-all duration-200">
              Choose Team
            </Link>
          </div>
        </div>
        <p className="muted-text text-center mt-6">Upgrade anytime. Cancel anytime.</p>
      </section>

      {/* ── PRIVACY ── */}
      <section className="mx-auto max-w-[1100px] px-6 py-20">
        <h2 className="section-title text-white mb-2">Private by default. Delete anytime.</h2>
        <p className="body-text">Your data stays yours.</p>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="mx-auto max-w-[1100px] px-6 py-24">
        <h2 className="text-[34px] font-semibold tracking-[-0.02em] text-white mb-4">Start with one relationship.</h2>
        <p className="text-[20px] text-white/65 mb-10">Create an account and get a clear next step today.</p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center h-[48px] px-8 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm active:scale-[0.98] transition-all duration-200"
        >
          Create account
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mx-auto max-w-[1100px] px-6 pb-16 pt-10 border-t border-white/10 flex justify-between items-center flex-wrap gap-4">
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
