import React from 'react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-40 md:pb-32 bg-[var(--bg-0)] text-[var(--text-0)] safe-top">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="mx-auto max-w-[1240px] px-4 flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeInOut' }} className="inline-flex items-center gap-2 border border-[var(--border-0)] rounded-full px-4 py-1.5 mb-8 bg-[rgba(255,255,255,0.02)]">
          <span className="w-2 h-2 rounded-full bg-[var(--blue)] animate-pulse" />
          <span className="text-[13px] uppercase tracking-[0.18em] text-[var(--text-1)]">Relational intelligence platform</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeInOut' }} className="text-[36px] md:text-[60px] lg:text-[80px] font-bold tracking-[-0.04em] leading-[0.95] mb-7" style={{ letterSpacing: '-0.03em' }}>
          See the structure behind every relationship.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeInOut' }} className="text-[18px] md:text-[22px] text-[var(--text-1)] leading-[1.65] mb-11 max-w-[560px] mx-auto">
          DEFRAG reveals patterns, triggers, and timing that shape connection — so you can respond with clarity instead of guesswork.
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-9">
          <Button variant="default" size="lg" asChild><a href="/auth/signup">Start free</a></Button>
          <Button variant="secondary" size="lg" asChild><a href="#how-it-works">See how it works</a></Button>
        </div>
      </div>
    </section>
  );
}
