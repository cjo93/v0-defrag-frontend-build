'use client';

import React, { useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { PersonNodeData, RelationshipEdgeData, CalculatedNode } from './types';
import { calculateRadialLayout } from './mapLayout';
import { PersonNode } from './PersonNode';
import { RelationshipEdge } from './RelationshipEdge';

type Props = {
  nodes: PersonNodeData[];
  edges: RelationshipEdgeData[];
  centerId: string;
};

const EASE = [0.22, 1, 0.36, 1];

export function SystemMap({ nodes, edges, centerId }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  // Use memoization for layout computation
  const layout = useMemo(() => calculateRadialLayout(nodes, centerId, 50, 50, 25, 40), [nodes, centerId]);

  return (
    <div ref={ref} className="relative w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden pointer-events-none">

      {/* Background Layers */}
      {[160, 260].map((size, ri) => (
        <motion.div
          key={size}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full border border-white/[0.04]"
          style={{ width: size, height: size }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.2 + ri * 0.15, ease: EASE }}
        />
      ))}

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.07), transparent 60%)' }}
        animate={inView ? { opacity: [0.4, 0.75, 0.4], scale: [0.95, 1.08, 0.95] } : {}}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* SVG Canvas for Edges */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="edgeAligned" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="50%" stopColor="white" stopOpacity="0.08" />
            <stop offset="100%" stopColor="white" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="edgeNeutral" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.12" />
            <stop offset="50%" stopColor="white" stopOpacity="0.04" />
            <stop offset="100%" stopColor="white" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="edgeTension" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="50%" stopColor="white" stopOpacity="0.08" />
            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="edgeActiveTension" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {inView && edges.map((edge, i) => {
          const sourceNode = layout.find(n => n.id === edge.source);
          const targetNode = layout.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          return (
            <RelationshipEdge
              key={edge.id}
              edge={edge}
              sourceNode={sourceNode}
              targetNode={targetNode}
              delay={0.3 + i * 0.08}
            />
          );
        })}
      </svg>

      {/* HTML Layer for Nodes */}
      {inView && layout.map((node, i) => (
        <PersonNode
          key={node.id}
          node={node}
          delay={0.15 + i * 0.1}
        />
      ))}
    </div>
  );
}
