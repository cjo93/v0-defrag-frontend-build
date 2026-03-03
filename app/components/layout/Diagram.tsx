'use client';

import { motion } from 'framer-motion';

export function Diagram() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40 z-[-1]">
      <motion.div
        className="w-[180px] h-[180px] rounded-full border border-[rgba(255,255,255,0.6)]"
        animate={{
          x: [0, 2, -2, 2, 0],
          y: [0, -3, 3, -3, 0],
        }}
        transition={{
          duration: 4,
          ease: "linear",
          repeat: Infinity,
        }}
      />
    </div>
  );
}
