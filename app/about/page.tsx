"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-start p-4 sm:p-8 pt-24 sm:pt-32">
      <div className="w-full max-w-2xl bg-black">
        <div className="mb-16">
          <Link
            href="/"
            className="inline-flex items-center text-[10px] text-white/50 hover:text-white mb-12 uppercase tracking-widest font-mono transition-colors"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            BACK TO CONSOLE
          </Link>

          <h1 className="text-5xl sm:text-6xl font-normal tracking-tight text-white mb-4 font-sans leading-none">
            System Overview
          </h1>
          <p className="text-sm font-mono text-white/70 max-w-xl leading-relaxed mt-6">
            DEFRAG is a structural awareness engine.
          </p>
          <p className="text-sm font-mono text-white/50 max-w-xl leading-relaxed mt-4">
            It is designed to map relational friction and provide real-time clarity under pressure. It is not a social network, it is not a wellness app, and it is not a substitute for professional mental health care.
          </p>
          <p className="text-sm font-mono text-white max-w-xl leading-relaxed mt-4 font-semibold">
            It is a utility. Built to interrupt repetition.
          </p>
        </div>

        <div className="space-y-16">
          {/* The Architecture */}
          <section className="border-t border-white/20 pt-8">
            <h2 className="text-white font-mono text-xs uppercase tracking-widest mb-6 font-semibold">
              The Architecture
            </h2>
            <div className="space-y-4">
              <p className="text-white/60 text-sm font-mono leading-relaxed">
                Most relational tools rely on self-reporting or gamified psychology. DEFRAG relies on deterministic mechanics and structural computation.
              </p>
              <p className="text-white/60 text-sm font-mono leading-relaxed">
                Behind the interface sits a multi-layered engine evaluating specific environmental and relational variables:
              </p>
              <ul className="list-none space-y-3 mt-4 text-sm font-mono text-white/70">
                <li className="flex items-start">
                  <span className="text-white mr-4">▪</span> <span><strong className="text-white font-normal">Stability:</strong> &nbsp; Identifying baseline reactions to pressure.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-4">▪</span> <span><strong className="text-white font-normal">Timing:</strong> &nbsp; Mapping high-friction windows where escalation is statistically probable.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-4">▪</span> <span><strong className="text-white font-normal">Decision Guard:</strong> &nbsp; Providing objective thresholds for irreversible choices.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-4">▪</span> <span><strong className="text-white font-normal">Conflict Correlation:</strong> &nbsp; Isolating the mechanical root of a recurring argument.</span>
                </li>
              </ul>
              <p className="text-white/60 text-sm font-mono leading-relaxed mt-6">
                We use AI strictly as a translation layer. It is an anti-drift mechanism, taking raw, computed structural data and formatting it into plain, clinical English. The AI does not guess, it does not hallucinate, and it does not moralize. It reports.
              </p>
            </div>
          </section>

          {/* The Interface */}
          <section className="border-t border-white/20 pt-8">
            <h2 className="text-white font-mono text-xs uppercase tracking-widest mb-6 font-semibold">
              The Interface
            </h2>
            <div className="space-y-4">
              <p className="text-white/60 text-sm font-mono leading-relaxed">
                DEFRAG is built for clarity, not engagement.
              </p>
              <p className="text-white/60 text-sm font-mono leading-relaxed">
                There are no gamified reward loops. No traffic-light color coding. No speech bubbles, gradients, or shadows.
              </p>
              <p className="text-white/60 text-sm font-mono leading-relaxed">
                Signals are delivered in absolute grayscale. The system tells you if structural tension is low, moderate, or elevated. It does not tell you what to feel. It provides the wireframe of the moment; you decide how to navigate it.
              </p>
              <p className="text-white/60 text-sm font-mono leading-relaxed">
                The interface is engineered to be referenced quickly, used to lower escalation, and then closed.
              </p>
            </div>
          </section>

          {/* Data Sovereignty */}
          <section className="border-t border-white/20 pt-8">
            <h2 className="text-white font-mono text-xs uppercase tracking-widest mb-6 font-semibold">
              Data Sovereignty
            </h2>
            <div className="space-y-4">
              <p className="text-white/60 text-sm font-mono leading-relaxed">
                Relational data is the most sensitive information a person can generate. The standard technology industry practice of commoditizing user behavior is incompatible with our mandate.
              </p>
              <p className="text-white/60 text-sm font-mono leading-relaxed">
                Our architecture enforces strict data isolation:
              </p>
              <ul className="list-none space-y-4 mt-4 text-sm font-mono text-white/70">
                <li className="flex flex-col sm:flex-row sm:items-start border-l border-white/10 pl-4 py-1">
                  <span className="text-white min-w-[140px] mb-1 sm:mb-0 uppercase tracking-wider text-[10px] pr-8">Encryption</span> <span className="text-white/60">Core identifying data is encrypted at the client level (AES-GCM) before it ever reaches our servers.</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:items-start border-l border-white/10 pl-4 py-1">
                  <span className="text-white min-w-[140px] mb-1 sm:mb-0 uppercase tracking-wider text-[10px] pr-8">Zero-Retention</span> <span className="text-white/60">You control your memory state. Historical context can be paused or permanently hard-deleted at any time, generating a verifiable deletion receipt.</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:items-start border-l border-white/10 pl-4 py-1">
                  <span className="text-white min-w-[140px] mb-1 sm:mb-0 uppercase tracking-wider text-[10px] pr-8">No Model Training</span> <span className="text-white/60">Your relational dynamics, chat logs, and structural maps are strictly prohibited from being used to silently train external AI models.</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:items-start border-l border-white/10 pl-4 py-1">
                  <span className="text-white min-w-[140px] mb-1 sm:mb-0 uppercase tracking-wider text-[10px] pr-8">Ephemeral Links</span> <span className="text-white/60">Secondary user data is collected via single-use, 24-hour expiring secure links.</span>
                </li>
              </ul>
              <p className="text-white text-sm font-mono leading-relaxed mt-6">
                You own the map. We just maintain the engine.
              </p>
            </div>
          </section>

          {/* The Objective */}
          <section className="border-t border-b border-white/20 py-8 mb-24">
            <h2 className="text-white font-mono text-xs uppercase tracking-widest mb-6 font-semibold">
              The Objective
            </h2>
            <div className="space-y-4">
              <p className="text-white font-mono leading-relaxed text-base">
                Instinct fails under pressure.
              </p>
              <p className="text-white/60 text-sm font-mono leading-relaxed">
                DEFRAG exists to bridge the gap between a moment of tension and a moment of reaction. By making invisible structural differences visible, the system lowers the operational cost of your most consequential relationships.
              </p>
              <p className="text-white/80 text-sm font-mono leading-relaxed mt-4">
                Use it to pause sooner. Use it to choose better timing. Use it to see the structure.
              </p>
            </div>
          </section>
        </div>

        {/* Minimal footer padding */}
        <div className="h-16"></div>
      </div>
    </main>
  );
}
