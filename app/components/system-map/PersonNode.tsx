import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PersonNodeData, CalculatedNode } from './types';

const ROLE_SIZES = {
  self: 24,
  partner: 16,
  parent: 14,
  child: 12,
  friend: 10,
  colleague: 8,
  ex: 10,
  sibling: 12,
  boss: 10,
};

type Props = {
  node: CalculatedNode;
  delay?: number;
};

export const PersonNode = React.memo(function PersonNode({ node, delay = 0 }: Props) {
  const isSelf = node.role === 'self';
  const size = ROLE_SIZES[node.role as keyof typeof ROLE_SIZES] || 12;
  const isReactive = node.state === 'reactive';
  const isRepairing = node.state === 'repairing';
  const isDistanced = node.state === 'distanced';

  // Opacity states based on relationship state rather than just role
  const opacity = isSelf ? 1 : isDistanced ? 0.3 : 0.7;

  return (
    <motion.div
      className="absolute flex flex-col items-center pointer-events-auto"
      aria-label={`Relationship dynamic with ${node.name.toLowerCase()}`}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
      initial={{ opacity: 0, scale: 0.2, x: '-50%', y: '-50%' }}
      animate={{ opacity, scale: 1, x: '-50%', y: '-50%' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Self Halo / Leverage Halo */}
      {(isSelf || node.isLeverage) && (
        <motion.div
          className={`absolute rounded-full border ${node.isLeverage ? 'border-white/[0.25]' : 'border-white/[0.15]'}`}
          style={{ width: size * 5.5, height: size * 5.5 }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Reactive Indicator Ring */}
      {isReactive && (
        <motion.div
          className="absolute rounded-full border border-white/[0.2]"
          style={{ width: size * 4.5, height: size * 4.5 }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.05, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay }}
        />
      )}

      {/* Repairing Glow */}
      {isRepairing && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 3, height: size * 3,
            background: 'radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%)'
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
        />
      )}

      {/* Core Node */}
      <motion.div
        className="rounded-full relative border border-white/[0.15]"
        style={{
          width: size * 2,
          height: size * 2,
          background: isSelf
            ? 'radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0.5))'
            : isReactive
              ? 'radial-gradient(circle, rgba(255,255,255,0.7), rgba(255,255,255,0.2))'
              : 'radial-gradient(circle, rgba(255,255,255,0.5), rgba(255,255,255,0.1))',
          boxShadow: node.isLeverage
            ? '0 0 24px rgba(255,255,255,0.4), 0 0 48px rgba(255,255,255,0.2)'
            : `0 0 ${isReactive ? 16 : 8}px rgba(255,255,255,${isReactive ? 0.15 : 0.05})`,
        }}
        animate={{ scale: [1, isSelf ? 1.08 : (isReactive ? 1.05 : 1.02), 1] }}
        transition={{ duration: isReactive ? 2 : 3, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        {node.isLeverage && (
           <span className="absolute -top-1 -right-1 text-white text-[10px] leading-none drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">✦</span>
        )}
      </motion.div>

      <motion.span
        className={`text-[11px] tracking-wide whitespace-nowrap mt-2 ${isSelf ? 'text-white/90 font-semibold' : node.isLeverage ? 'text-white/90' : isReactive ? 'text-white/80' : 'text-white/40'}`}
        style={{ opacity: isDistanced ? 0.5 : 1 }}
        animate={isReactive ? { y: [0, -1, 1, -0.5, 0.5, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        {node.name}
      </motion.span>
    </motion.div>
  );
});
