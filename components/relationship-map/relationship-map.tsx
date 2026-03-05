'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type Person = {
  id: string;
  name: string;
  relationship_label?: string;
  relationship_state?: 'stable' | 'improving' | 'strained' | 'cooling' | 'unclear';
};

const STATE_COLOR: Record<string, string> = {
  stable: 'rgba(255,255,255,0.35)',
  improving: 'rgba(255,255,255,0.55)',
  strained: 'rgba(255,255,255,0.75)',
  cooling: 'rgba(255,255,255,0.45)',
  unclear: 'rgba(255,255,255,0.25)',
};

const STATE_LABEL: Record<string, string> = {
  stable: 'Stable',
  improving: 'Improving',
  strained: 'Strained',
  cooling: 'Cooling',
  unclear: 'Unclear',
};

const STATE_ORDER: Record<string, number> = {
  strained: 0,
  cooling: 1,
  improving: 2,
  stable: 3,
  unclear: 4,
};

const MAX_VISIBLE = 12;
const RADIUS = 140;
const SIZE = 380;
const CENTER = SIZE / 2;

export default function RelationshipMap({ people }: { people: Person[] }) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (people.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-[14px] text-white/45">Add people to begin mapping your relationships.</p>
      </div>
    );
  }

  const visible = [...people]
    .sort((a, b) => (STATE_ORDER[a.relationship_state ?? 'unclear'] ?? 4) - (STATE_ORDER[b.relationship_state ?? 'unclear'] ?? 4))
    .slice(0, MAX_VISIBLE);

  const angleStep = (2 * Math.PI) / visible.length;
  const hoveredPerson = visible.find(p => p.id === hoveredId);

  const nodes = visible.map((person, i) => {
    const angle = angleStep * i - Math.PI / 2;
    return {
      ...person,
      x: CENTER + RADIUS * Math.cos(angle),
      y: CENTER + RADIUS * Math.sin(angle),
    };
  });

  return (
    <div className="flex items-center justify-center w-full relative">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-[380px]"
        style={{ overflow: 'visible' }}
      >
        {/* Connection lines */}
        {nodes.map((node) => {
          const isHovered = hoveredId === node.id;
          return (
            <line
              key={`line-${node.id}`}
              x1={CENTER}
              y1={CENTER}
              x2={node.x}
              y2={node.y}
              stroke={isHovered ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)'}
              strokeWidth={1}
              style={{
                opacity: mounted ? 1 : 0,
                transition: 'opacity 300ms ease, stroke 200ms ease',
              }}
            />
          );
        })}

        {/* Center node — user */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={7}
          fill="white"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.8)',
            transformOrigin: `${CENTER}px ${CENTER}px`,
            transition: 'opacity 250ms ease, transform 250ms ease',
          }}
        />
        <text
          x={CENTER}
          y={CENTER + 22}
          fontSize="10"
          fill="rgba(255,255,255,0.35)"
          textAnchor="middle"
          fontFamily="monospace"
          letterSpacing="0.08em"
          className="select-none pointer-events-none uppercase"
          style={{
            opacity: mounted ? 1 : 0,
            transition: 'opacity 350ms ease',
          }}
        >
          YOU
        </text>

        {/* Person nodes with state rings */}
        {nodes.map((node, i) => {
          const state = node.relationship_state ?? 'unclear';
          const isHovered = hoveredId === node.id;
          const delay = 80 + i * 40;

          return (
            <g
              key={node.id}
              className="cursor-pointer"
              onMouseEnter={(e) => {
                setHoveredId(node.id);
                const svg = e.currentTarget.closest('svg');
                if (svg) {
                  const rect = svg.getBoundingClientRect();
                  const scaleX = rect.width / SIZE;
                  const scaleY = rect.height / SIZE;
                  setTooltipPos({
                    x: node.x * scaleX,
                    y: node.y * scaleY - 16,
                  });
                }
              }}
              onMouseLeave={() => {
                setHoveredId(null);
                setTooltipPos(null);
              }}
              onClick={() => router.push(`/chat?person_id=${node.id}`)}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'scale(1)' : 'scale(0.9)',
                transformOrigin: `${node.x}px ${node.y}px`,
                transition: `opacity 200ms ease ${delay}ms, transform 200ms ease ${delay}ms`,
              }}
            >
              {/* State ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? 12 : 10}
                fill="none"
                stroke={STATE_COLOR[state] ?? STATE_COLOR.unclear}
                strokeWidth={1.5}
                className={`transition-all duration-200${state === 'strained' ? ' animate-strained-pulse' : ''}`}
              />

              {/* Person dot */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? 6 : 5}
                fill="white"
                className="transition-all duration-200"
              />

              {/* Name label */}
              <text
                x={node.x}
                y={node.y + 22}
                fontSize="11"
                fill={isHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)'}
                textAnchor="middle"
                className="select-none pointer-events-none transition-all duration-200"
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hoveredPerson && tooltipPos && (
        <div
          className="absolute pointer-events-none animate-fade-in z-10"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="border border-white/15 bg-white/[0.04] rounded-sm px-3 py-2 space-y-0.5 shadow-lg">
            <p className="text-[13px] text-white font-medium whitespace-nowrap">{hoveredPerson.name}</p>
            {hoveredPerson.relationship_label && (
              <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.12em]">
                {hoveredPerson.relationship_label}
              </p>
            )}
            <p className="font-mono text-[10px] text-white/50 uppercase tracking-[0.12em]">
              {STATE_LABEL[hoveredPerson.relationship_state ?? 'unclear']}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
