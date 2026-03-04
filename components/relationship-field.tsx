'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Person = {
  id: string;
  name: string;
  relationship_label?: string;
  relationship_state?: 'stable' | 'improving' | 'strained' | 'cooling' | 'unclear';
};

const STATE_STROKE: Record<string, string> = {
  stable: 'rgba(255,255,255,0.35)',
  improving: 'rgba(255,255,255,0.55)',
  strained: 'rgba(255,255,255,0.75)',
  cooling: 'rgba(255,255,255,0.45)',
  unclear: 'rgba(255,255,255,0.25)',
};

const STATE_ORDER: Record<string, number> = {
  strained: 0,
  cooling: 1,
  improving: 2,
  stable: 3,
  unclear: 4,
};

const MAX_VISIBLE = 12;
const RADIUS = 160;
const SIZE = 400;
const CENTER = SIZE / 2;

export default function RelationshipField({ people }: { people: Person[] }) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (people.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-[14px] text-white/45">Add people to begin mapping your relationships.</p>
      </div>
    );
  }

  // Sort by state priority, limit to 12
  const visible = [...people]
    .sort((a, b) => (STATE_ORDER[a.relationship_state ?? 'unclear'] ?? 4) - (STATE_ORDER[b.relationship_state ?? 'unclear'] ?? 4))
    .slice(0, MAX_VISIBLE);

  const angleStep = (2 * Math.PI) / visible.length;

  return (
    <div className="flex items-center justify-center w-full">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-[400px]"
        style={{ overflow: 'visible' }}
      >
        {/* Connection lines */}
        {visible.map((person, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const x = CENTER + RADIUS * Math.cos(angle);
          const y = CENTER + RADIUS * Math.sin(angle);
          const isHovered = hoveredId === person.id;

          return (
            <line
              key={`line-${person.id}`}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke={isHovered ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)'}
              strokeWidth={1}
              className="transition-all duration-200"
            />
          );
        })}

        {/* Center node — user */}
        <circle cx={CENTER} cy={CENTER} r={8} fill="white" />

        {/* Person nodes */}
        {visible.map((person, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const x = CENTER + RADIUS * Math.cos(angle);
          const y = CENTER + RADIUS * Math.sin(angle);
          const state = person.relationship_state ?? 'unclear';
          const isHovered = hoveredId === person.id;

          return (
            <g
              key={person.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredId(person.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => router.push(`/chat?person_id=${person.id}`)}
            >
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 7 : 5}
                fill="white"
                stroke={STATE_STROKE[state] ?? STATE_STROKE.unclear}
                strokeWidth={1.5}
                className={`transition-all duration-200${state === 'strained' ? ' animate-strained-pulse' : ''}`}
              />
              <text
                x={x}
                y={y + 18}
                fontSize="11"
                fill="rgba(255,255,255,0.55)"
                textAnchor="middle"
                className="select-none pointer-events-none"
              >
                {person.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
