'use client';

import { useEffect, useState } from 'react';

const PEOPLE = [
  { label: 'Mom', angle: -70, opacity: 0.9 },
  { label: 'Dad', angle: -25, opacity: 0.55 },
  { label: 'Sister', angle: 20, opacity: 0.75 },
  { label: 'Partner', angle: 70, opacity: 0.95 },
  { label: 'Best friend', angle: 130, opacity: 0.7 },
  { label: 'Boss', angle: 195, opacity: 0.45 },
  { label: 'Ex', angle: 250, opacity: 0.35 },
];

export function RelationshipMapPreview() {
  const cx = 240, cy = 160, r = 120;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <svg viewBox="0 0 480 320" className="w-full mx-auto" aria-label="Relationship map preview">
      {/* Lines from center to each person */}
      {PEOPLE.map((n) => {
        const rad = (n.angle * Math.PI) / 180;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);
        return (
          <line
            key={`line-${n.label}`}
            x1={cx} y1={cy} x2={x} y2={y}
            stroke={`rgba(255,255,255,${n.opacity * 0.18})`}
            strokeWidth={1}
            className="transition-all duration-700"
            style={{
              opacity: mounted ? 1 : 0,
            }}
          />
        );
      })}

      {/* Center node (You) */}
      <circle
        cx={cx} cy={cy} r={10}
        fill="white"
        className="transition-all duration-500"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'scale(1)' : 'scale(0.5)',
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />
      <text x={cx} y={cy + 24} fontSize="10" fill="rgba(255,255,255,0.35)" textAnchor="middle" fontFamily="monospace">
        YOU
      </text>

      {/* Person nodes */}
      {PEOPLE.map((n, i) => {
        const rad = (n.angle * Math.PI) / 180;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);
        return (
          <g
            key={n.label}
            className="transition-all duration-500"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'scale(1)' : 'scale(0.8)',
              transformOrigin: `${x}px ${y}px`,
              transitionDelay: `${150 + i * 60}ms`,
            }}
          >
            <circle
              cx={x} cy={y} r={6}
              fill={`rgba(255,255,255,${n.opacity * 0.12})`}
              stroke={`rgba(255,255,255,${n.opacity * 0.5})`}
              strokeWidth={1}
            />
            <text
              x={x} y={y - 12}
              fontSize="11"
              fill={`rgba(255,255,255,${n.opacity * 0.7})`}
              textAnchor="middle"
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
