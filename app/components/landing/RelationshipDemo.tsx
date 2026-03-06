'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SystemMap } from '../system-map/SystemMap';
import { PersonNodeData, RelationshipEdgeData } from '../system-map/types';

const EASE = [0.22, 1, 0.36, 1];

export function RelationshipDemo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const nodes: PersonNodeData[] = [
    { id: 'you', name: 'You', role: 'self', intensity: 1, state: 'stable' },
    { id: 'partner', name: 'Partner', role: 'partner', intensity: 0.9, state: 'reactive', isLeverage: true },
    { id: 'sibling', name: 'Sibling', role: 'sibling', intensity: 0.6, state: 'stable' },
    { id: 'mom', name: 'Mom', role: 'parent', intensity: 0.7, state: 'distanced' },
    { id: 'dad', name: 'Dad', role: 'parent', intensity: 0.8, state: 'stable' },
    { id: 'friend', name: 'Friend', role: 'friend', intensity: 0.4, state: 'distanced' },
  ];

  const edges: RelationshipEdgeData[] = [
    { id: 'e1', source: 'you', target: 'partner', pattern: 'push-pull', intensity: 0.8, isLeverage: true },
    { id: 'e2', source: 'you', target: 'sibling', pattern: 'stable', intensity: 0.4 },
    { id: 'e3', source: 'you', target: 'mom', pattern: 'avoidant', intensity: 0.3 },
    { id: 'e4', source: 'you', target: 'dad', pattern: 'stable', intensity: 0.6 },
    { id: 'e5', source: 'you', target: 'friend', pattern: 'avoidant', intensity: 0.2 },
  ];

  return (
    <div ref={ref} className="relative w-full h-[400px] flex items-center justify-center">

      {/* MAP AREA */}
      <div className="absolute inset-y-0 left-0 right-[320px] max-md:right-0 max-md:bottom-[160px] overflow-hidden">
        <SystemMap nodes={nodes} edges={edges} centerId="you" />
      </div>

      {/* INFO PANEL */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[280px] max-md:w-[calc(100%-48px)] max-md:max-w-none max-md:top-auto max-md:bottom-0 max-md:translate-y-0 p-6 bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl z-10"
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-white/80 df-vibrate" />
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white/50">Active Dynamic</span>
        </div>

        <div className="space-y-6">
          <div>
            <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-white/30 mb-1.5">Pattern</span>
            <span className="block text-[15px] text-white/90 font-medium">Push / withdraw loop</span>
          </div>

          <div>
            <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-white/30 mb-1.5">Leverage point</span>
            <span className="block text-[14px] text-white/70">Pause pursuit during withdrawal</span>
          </div>

          <div>
            <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-white/30 mb-1.5">Best move</span>
            <span className="block text-[14px] text-white/70">Reopen the conversation tomorrow afternoon</span>
          </div>

          <div>
            <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-white/30 mb-2">One line to say</span>
            <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
              <span className="block text-[14px] text-white/85 italic leading-relaxed">
                "I want to talk about this when we're both calmer."
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes df-dash-flow {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
