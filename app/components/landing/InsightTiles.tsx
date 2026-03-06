'use client';

import { motion } from 'framer-motion';

const TILES = [
  {
    id: 'dynamic',
    label: 'Dynamic',
    value: 'Push ↔ Withdraw',
    icon: '↔'
  },
  {
    id: 'trigger',
    label: 'Trigger',
    value: 'Space → Distance',
    icon: '⚡'
  },
  {
    id: 'leverage',
    label: 'Leverage',
    value: 'Pause pursuit',
    icon: '⏸'
  },
  {
    id: 'best_move',
    label: 'Best Move',
    value: 'Wait 18–24h',
    icon: '⏳'
  },
  {
    id: 'line',
    label: 'Line',
    value: '“Let’s talk when we’re calmer.”',
    icon: '💬'
  }
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function InsightTiles() {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-3 w-full max-w-[1200px] mx-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          }
        }
      }}
    >
      {TILES.map((tile, i) => (
        <motion.div
          key={tile.id}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }
          }}
          className={`
            relative bg-[#09090b] border border-white/[0.08] rounded-xl p-4 md:p-5 flex flex-col justify-between
            ${i === TILES.length - 1 ? 'sm:col-span-2 lg:col-span-1 lg:flex-1' : 'flex-1'}
          `}
          style={{
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-semibold text-white/40">
              {tile.label}
            </span>
            <span className="text-[12px] text-white/20 opacity-80" aria-hidden="true">
              {tile.icon}
            </span>
          </div>
          <span className="text-[14px] md:text-[15px] font-medium text-white/90 leading-tight">
            {tile.value}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
