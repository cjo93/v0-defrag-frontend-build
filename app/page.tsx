'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BuildStamp } from '@/components/build-stamp';
import { IntroAnimation } from '@/components/intro-animation';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    // Check if user has seen intro before
    const seen = localStorage.getItem('defrag-intro-seen');
    if (seen) {
      setShowIntro(false);
      setHasSeenIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem('defrag-intro-seen', 'true');
    setShowIntro(false);
    setHasSeenIntro(true);
  };

  if (showIntro && !hasSeenIntro) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex flex-1 flex-col justify-center px-6 py-16 safe-top safe-bottom md:px-10">
        <div className="max-w-[640px] mx-auto">
          {/* Headline - locked typography */}
          <h1 className="font-display text-[38px] md:text-[56px] leading-[1.18] tracking-[-0.01em] font-medium text-white">
            The user manual for you, and your people.
          </h1>
          
          {/* Subhead - static, restrained */}
          <p className="mt-8 text-[16px] leading-[1.75] text-white/45 max-w-[480px]">
            Your parent. Your partner. Your legacy.
          </p>
          
          {/* CTA - statement not button */}
          <Link href="/connect" className="mt-16 inline-block">
            <span className="text-[14px] tracking-[0.18em] uppercase text-white/80 hover:text-white">
              Begin
            </span>
          </Link>
          
          {/* Sign in - subtle reference */}
          <Link href="/connect" className="mt-6 block text-[14px] text-white/30 hover:text-white/50">
            Sign in
          </Link>
        </div>
        <div className="flex items-center gap-6 text-sm font-sans">
          <a href="#early-access" className="text-white/80 hover:text-white transition-colors">Early Access</a>
          <a href="mailto:info@defrag.app" className="text-white/80 hover:text-white transition-colors">Contact</a>
        </div>
      </nav>

      <main className="relative pt-24 pb-32">
        {/* 2. HERO */}
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
          {/* Schematic Overlay (Faint wireframe) */}
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
             <div className="w-[800px] h-[800px] border border-white/20 relative">
                {/* Instrument reticle */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30" />
                {/* Grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
             </div>
          </div>

          <div className="relative z-10 max-w-4xl flex flex-col items-center">
            {/* Optional provocation */}
            <p className="text-xs tracking-[0.2em] text-white/50 mb-6 uppercase font-sans">
              Pattern is law.
            </p>

            {/* Crystallization Effect Headline */}
            <h1
              className={`text-5xl md:text-7xl font-serif mb-8 leading-tight transition-all duration-[1200ms] ease-out ${
                isLoaded ? 'blur-0 opacity-100' : 'blur-3xl opacity-0'
              }`}
            >
              Structural Intelligence<br/>for Human Dynamics.
            </h1>

            <p
              className={`text-lg md:text-xl font-sans text-white/80 mb-6 max-w-2xl transition-all duration-1000 delay-[120ms] ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              Relational Blueprint Intelligence — a technical manual for you and your people.
            </p>

            <p
              className={`font-mono text-sm text-white/60 mb-10 transition-all duration-1000 delay-[120ms] ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              Coming soon. Early access is limited.
            </p>

            <div
              className={`flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto transition-all duration-1000 delay-[220ms] ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5'
              }`}
            >
              <a
                href="#early-access"
                className="w-full sm:w-auto px-8 py-4 bg-white text-black font-sans text-sm font-medium hover:bg-white/90 transition-colors flex items-center justify-center"
              >
                Request Early Access
              </a>
              <a
                href="mailto:info@defrag.app?subject=Inquiry&body=Hello,"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/12 text-white font-sans text-sm font-medium hover:bg-white/5 transition-colors flex items-center justify-center"
              >
                Email info@defrag.app
              </a>
            </div>
          </div>
        </section>

        {/* 3. WHAT IT IS */}
        <section className="px-6 py-24 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/12">
            {[
              {
                title: "Blueprint",
                desc: "How you’re built under pressure.",
                micro: "Clarity request → emotional defense"
              },
              {
                title: "Timing",
                desc: "When amplification and sensitivity rise.",
                micro: "Shared amplification window → escalation risk"
              },
              {
                title: "Interaction",
                desc: "How two structures create repeatable loops.",
                micro: "Authority friction → withdrawal pattern"
              }
            ].map((item, i) => (
              <div key={i} className="p-8 border-b md:border-b-0 md:border-r border-white/12 last:border-b-0 last:border-r-0">
                <h3 className="text-2xl font-serif mb-4">{item.title}</h3>
                <p className="text-white/80 font-sans mb-8 leading-relaxed">
                  {item.desc}
                </p>
                <div className="font-mono text-xs text-white/60 bg-white/5 p-3">
                  {item.micro}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section className="px-6 py-24 max-w-4xl mx-auto">
          <div className="border border-white/12 p-12 relative overflow-hidden">
             {/* Pipeline Diagram */}
             <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 relative z-10">
                <div className="flex-1 text-center">
                   <div className="font-sans text-sm text-white/60 mb-2 uppercase tracking-widest">Input</div>
                   <div className="font-mono text-sm border border-white/20 py-3 px-4">birth data + system tags</div>
                </div>
                <div className="text-white/30 hidden md:block">→</div>
                <div className="flex-1 text-center">
                   <div className="font-sans text-sm text-white/60 mb-2 uppercase tracking-widest">Engine</div>
                   <div className="font-mono text-sm border border-white/20 py-3 px-4 bg-white/5">deterministic computation</div>
                </div>
                <div className="text-white/30 hidden md:block">→</div>
                <div className="flex-1 text-center">
                   <div className="font-sans text-sm text-white/60 mb-2 uppercase tracking-widest">Output</div>
                   <div className="font-mono text-xs border border-white/20 py-3 px-4 text-left">
                      blueprint<br/>timing overlay<br/>interaction map<br/>adjustment protocol
                   </div>
                </div>
             </div>

             {/* Air-gap Callout */}
             <div className="text-center border-t border-white/12 pt-12 relative z-10">
                <h4 className="font-sans text-xs tracking-[0.15em] text-white/50 mb-4 uppercase">Air-Gap Security</h4>
                <p className="font-serif text-xl mb-2">The engine calculates. The interface displays.</p>
                <p className="font-sans text-white/60 text-sm">No training on user data. Minimal collection.</p>
             </div>

             {/* Background decorative lines */}
             <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                 <div className="w-full h-px bg-white" />
             </div>
          </div>
        </section>

        {/* 5. WHAT YOU RECEIVE */}
        <section className="px-6 py-24 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 border-l border-white/12 pl-8">
              <h2 className="text-3xl font-serif mb-8">System Outputs</h2>
              {[
                { label: "Blueprint Readout", desc: "(stable)" },
                { label: "Timing Overlay", desc: "(daily/seasonal)" },
                { label: "Interaction Map", desc: "(pairwise dynamics)" },
                { label: "Adjustment Protocols", desc: "(scripted interventions)" }
              ].map((item, i) => (
                <div key={i} className="flex items-baseline justify-between border-b border-white/12 pb-4">
                  <span className="font-sans text-lg">{item.label}</span>
                  <span className="font-mono text-sm text-white/50">{item.desc}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#0a0a0a] border border-white/12 p-6 font-mono text-xs text-white/90 overflow-x-auto">
<pre>{`{
  "signal_packet": {
    "id": "bp_7x9q2m",
    "status": "computed",
    "dynamics": {
      "primary_driver": "structural_logic",
      "friction_points": [
        "emotional_ambiguity",
        "undefined_authority"
      ]
    },
    "intervention": "Protocol Beta-4 required."
  }
}`}</pre>
            </div>
          </div>
        </section>

        {/* 6. SOFT SOCIAL PROOF */}
        <section className="px-6 py-12 max-w-3xl mx-auto text-center border-t border-b border-white/12">
           <p className="font-sans text-sm text-white/60">
             Private alpha with founders, operators, and practitioners. Early access opens in waves.
           </p>
        </section>

        {/* 7. EARLY ACCESS CAPTURE */}
        <section id="early-access" className="px-6 py-32 max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-4">Request Access</h2>
          <p className="font-sans text-white/60 mb-10 text-sm">No spam. One launch note + limited alpha invites.</p>

          <form className="space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email Address *" required className="w-full bg-transparent border border-white/12 px-4 py-3 font-sans text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40" />
            <input type="text" placeholder="Name" className="w-full bg-transparent border border-white/12 px-4 py-3 font-sans text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40" />
            <div className="grid grid-cols-2 gap-4">
               <input type="text" placeholder="Company (optional)" className="w-full bg-transparent border border-white/12 px-4 py-3 font-sans text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40" />
               <input type="text" placeholder="Use case (optional)" className="w-full bg-transparent border border-white/12 px-4 py-3 font-sans text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40" />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button type="submit" className="flex-1 bg-white text-black font-sans text-sm font-medium py-4 hover:bg-white/90 transition-colors">
                Request Early Access
              </button>
              <a href="mailto:info@defrag.app" className="flex-1 bg-transparent border border-white/12 text-white font-sans text-sm font-medium py-4 hover:bg-white/5 transition-colors text-center flex items-center justify-center">
                Email info@defrag.app
              </a>
            </div>
          </form>
        </section>

      </main>
      
      <BuildStamp />
    </div>
  );
}
