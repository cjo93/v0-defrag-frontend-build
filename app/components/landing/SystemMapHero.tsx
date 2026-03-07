'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SystemMap } from '../system-map/SystemMap';
import { PersonNodeData, RelationshipEdgeData } from '../system-map/types';

const EASE = [0.22, 1, 0.36, 1];

export default function SystemMapHero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const nodes: PersonNodeData[] = [
    { id: 'you', name: 'You', role: 'self', intensity: 1, state: 'stable' },
    { id: 'partner', name: 'Partner', role: 'partner', intensity: 0.9, state: 'reactive', isLeverage: true },
    { id: 'parent', name: 'Parent', role: 'parent', intensity: 0.7, state: 'distanced' },
    { id: 'friend', name: 'Friend', role: 'friend', intensity: 0.4, state: 'distanced' },
    { id: 'sibling', name: 'Sibling', role: 'sibling', intensity: 0.6, state: 'stable' },
  ];

  const edges: RelationshipEdgeData[] = [
    { id: 'e1', source: 'you', target: 'partner', pattern: 'push-pull', intensity: 0.8, isLeverage: true },
    { id: 'e2', source: 'you', target: 'parent', pattern: 'avoidant', intensity: 0.3 },
    { id: 'e3', source: 'you', target: 'friend', pattern: 'avoidant', intensity: 0.2 },
    { id: 'e4', source: 'you', target: 'sibling', pattern: 'stable', intensity: 0.4 },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto mt-16 md:mt-24 mb-16 px-4 md:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center mb-10 md:mb-16"
      >
        <h2 className="text-[28px] md:text-[40px] font-bold tracking-[-0.03em] leading-[1.1] text-white">
          See the system behind your relationships.
        </h2>
      </motion.div>

      <div ref={ref} className="relative w-full flex flex-col md:flex-row items-center justify-center rounded-[24px] border border-white/[0.04] bg-[#09090b] shadow-[0_0_60px_rgba(255,255,255,0.02)] overflow-hidden">

        {/* MAP AREA */}
        <div className="relative w-full h-[260px] md:h-[420px] flex-1 flex items-center justify-center overflow-hidden">
          <SystemMap nodes={nodes} edges={edges} centerId="you" />
        </div>

        {/* INFO PANEL */}
        <motion.div
          className="relative w-full md:absolute md:right-8 md:w-[320px] p-6 md:p-8 bg-[#09090b] border-t md:border-t-0 md:border border-white/10 md:rounded-2xl shadow-none md:shadow-2xl z-10 flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-white/80 df-vibrate" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white/50">Active Dynamic</span>
          </div>

          <div className="space-y-6 text-left">
            <div>
              <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-white/30 mb-1.5">Active pattern</span>
              <span className="block text-[15px] text-white/90 font-medium">Push / withdraw loop</span>
            </div>

            <div>
              <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-white/30 mb-1.5">Leverage point</span>
              <span className="block text-[14px] text-white/70">Pause pursuit during withdrawal phase</span>
            </div>

            <div>
              <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-white/30 mb-1.5">Best opening</span>
              <span className="block text-[14px] text-white/70">Later today</span>
            </div>

            <div>
              <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-white/30 mb-2">One line</span>
              <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                <span className="block text-[14px] text-white/85 italic leading-relaxed">
                  "I want to talk when we're both calmer."
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <style jsx global>{`
          @keyframes df-dash-flow {
            to { stroke-dashoffset: 0; }
          }
          .df-vibrate {
            animation: df-vibrate-keyframes 2s infinite ease-in-out;
          }
          @keyframes df-vibrate-keyframes {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
      </div>
    </div>
  );
}
