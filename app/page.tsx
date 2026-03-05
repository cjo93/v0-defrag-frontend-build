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
      <section className="mx-auto max-w-[720px] px-6 pt-28 pb-20 text-center space-y-6">
        <h1 className="text-[36px] md:text-[42px] font-medium tracking-tight leading-tight text-white">
          Clarity for hard relationships.
        </h1>
        <p className="text-[16px] md:text-[18px] text-white/60 leading-relaxed max-w-[520px] mx-auto">
          Understand tension, timing, and repeating patterns so you can choose a calmer next step.
        </p>
        <div className="pt-2">
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center h-12 px-8 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:bg-white/90 active:scale-[0.98] transition-all duration-200"
          >
            Get your blueprint
          </Link>
        </div>
      </section>

      {/* ── RELATIONSHIP MAP VISUAL ── */}
      <section className="mx-auto max-w-[900px] px-6 mt-14">
        <div className="border border-white/10 bg-white/[0.02] p-8 md:p-10 rounded-sm">
          <RelationshipMapPreview />
        </div>
        <p className="text-center text-[14px] text-white/40 mt-5 leading-relaxed">
          A living map of your relationships.<br />
          See where tension forms — and where it settles.
        </p>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section className="mx-auto max-w-[1000px] px-6 mt-24">
        <div className="text-center mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40 mb-3">Dashboard</p>
          <h2 className="text-[28px] md:text-[32px] font-medium tracking-tight text-white">
            Your daily overview at a glance.
          </h2>
        </div>
        <DashboardPreview />
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="mx-auto max-w-[1000px] px-6 mt-28">
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40 mb-3">How it helps</p>
          <h2 className="text-[28px] md:text-[32px] font-medium tracking-tight text-white">
            Three things that change the dynamic.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'See the pattern', body: 'Spot what keeps repeating — without blame or guesswork.' },
            { title: 'Choose better timing', body: 'Know when to speak, pause, or wait for a cleaner opening.' },
            { title: 'Speak without escalation', body: 'Get calmer wording and a clearer plan for the moment.' },
          ].map((card) => (
            <div
              key={card.title}
              className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-sm hover:border-white/20 transition-colors duration-200"
            >
              <h3 className="text-[16px] font-medium text-white mb-3">{card.title}</h3>
              <p className="text-[14px] text-white/60 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CHAT PREVIEW ── */}
      <section className="mx-auto max-w-[820px] px-6 mt-28">
        <div className="text-center mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40 mb-3">Chat</p>
          <h2 className="text-[28px] md:text-[32px] font-medium tracking-tight text-white">
            Ask anything about a relationship.
          </h2>
          <p className="text-[14px] text-white/50 mt-3">Calm, clear guidance — never blame, never escalation.</p>
        </div>
        <ChatPreview />
      </section>

      {/* ── PRICING ── */}
      <section className="mx-auto max-w-[820px] px-6 mt-28">
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40 mb-3">Pricing</p>
          <h2 className="text-[28px] md:text-[32px] font-medium tracking-tight text-white">
            Simple, transparent plans.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm flex flex-col space-y-6 hover:border-white/20 transition-colors duration-200">
            <div>
              <h3 className="text-[22px] font-medium text-white">Solo</h3>
              <p className="text-[32px] font-medium text-white mt-2">$19<span className="text-[14px] font-normal text-white/40 ml-1">/ month</span></p>
            </div>
            <ul className="flex flex-col gap-3 text-[14px] text-white/60 leading-relaxed flex-1">
              <li>Personal dashboard</li>
              <li>Relationship Q&amp;A in chat</li>
              <li>Saved history</li>
            </ul>
            <Link href="/auth/signup" className="inline-flex items-center justify-center h-12 w-full bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:bg-white/90 active:scale-[0.98] transition-all duration-200">
              Choose Solo
            </Link>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm flex flex-col space-y-6 hover:border-white/20 transition-colors duration-200">
            <div>
              <h3 className="text-[22px] font-medium text-white">Team</h3>
              <p className="text-[32px] font-medium text-white mt-2">$33<span className="text-[14px] font-normal text-white/40 ml-1">/ month</span></p>
            </div>
            <ul className="flex flex-col gap-3 text-[14px] text-white/60 leading-relaxed flex-1">
              <li>Add family or close relationships</li>
              <li>Compare dynamics across people</li>
              <li>Deeper context in chat</li>
            </ul>
            <Link href="/auth/signup" className="inline-flex items-center justify-center h-12 w-full border border-white/10 text-white/80 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:text-white hover:border-white/20 active:scale-[0.98] transition-all duration-200">
              Choose Team
            </Link>
          </div>
        </div>
        <p className="text-[12px] text-white/35 text-center mt-6">Upgrade anytime. Cancel anytime.</p>
      </section>

      {/* ── TRUST / PRIVACY ── */}
      <section className="mx-auto max-w-[720px] px-6 mt-28 text-center space-y-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">Privacy</p>
        <h2 className="text-[28px] md:text-[32px] font-medium tracking-tight text-white">
          Private by default. Delete anytime.
        </h2>
        <p className="text-[14px] text-white/50 leading-relaxed max-w-[420px] mx-auto">
          Your data stays yours. No sharing, no selling. Delete your account and everything disappears.
        </p>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="mx-auto max-w-[720px] px-6 mt-28 pb-20 text-center space-y-6">
        <h2 className="text-[28px] md:text-[36px] font-medium tracking-tight text-white">
          Start with one relationship.
        </h2>
        <p className="text-[16px] text-white/50 leading-relaxed">
          Create an account and get a clear next step today.
        </p>
        <div className="pt-2">
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center h-12 px-8 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:bg-white/90 active:scale-[0.98] transition-all duration-200"
          >
            Create account
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mx-auto max-w-[1100px] px-6 pb-16 pt-10 border-t border-white/10 flex justify-between items-center flex-wrap gap-4">
        <span className="font-mono text-[11px] tracking-[0.15em] text-white/30 uppercase">
          DEFRAG &copy; {new Date().getFullYear()}
        </span>
        <div className="flex gap-6">
          <Link href="/principles" className="font-mono text-[11px] tracking-[0.15em] text-white/30 uppercase hover:text-white/60 transition-colors duration-200 py-2">
            Principles
          </Link>
          <Link href="/contact" className="font-mono text-[11px] tracking-[0.15em] text-white/30 uppercase hover:text-white/60 transition-colors duration-200 py-2">
            Contact
          </Link>
        </div>
      </footer>

    </main>
  );
}
