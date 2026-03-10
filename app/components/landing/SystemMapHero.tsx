import React from 'react';
import { RelationshipDemo } from './RelationshipDemo';

export default function SystemMapHero() {
  return (
    <section className="w-full max-w-[1200px] mx-auto mt-10 md:mt-16 px-6">
      <div className="rounded-[24px] border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.04)]">
        <div className="border-b border-white/[0.08] px-6 py-4 md:px-8 md:py-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-mono">Live Family Map</p>
            <h3 className="text-[20px] md:text-[24px] tracking-[-0.02em] text-white">See active relational dynamics</h3>
          </div>
          <span className="text-[11px] uppercase tracking-[0.14em] text-white/45 font-mono">Preview</span>
        </div>
        <div className="h-[340px] md:h-[460px] relative">
          <RelationshipDemo />
        </div>
      </div>
    </section>
  );
}
