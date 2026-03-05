'use client';

import { useEffect, useState } from 'react';

const PEOPLE = [
  { label: 'Mom', angle: -70, strength: 0.9 },
  { label: 'Dad', angle: -25, strength: 0.55 },
  { label: 'Sister', angle: 20, strength: 0.75 },
  { label: 'Partner', angle: 70, strength: 0.95 },
  { label: 'Best friend', angle: 130, strength: 0.7 },
  { label: 'Boss', angle: 195, strength: 0.45 },
  { label: 'Ex', angle: 250, strength: 0.35 },
];

/** Interpolate between purple and indigo based on strength */
function accentColor(strength: number, alpha: number) {
  const r = Math.round(139 + (99 - 139) * (1 - strength));
  const g = Math.round(92 + (102 - 92) * (1 - strength));
  const b = Math.round(246 + (241 - 246) * (1 - strength));
  return `rgba(${r},${g},${b},${alpha})`;
}

export function RelationshipMapPreview() {
  const cx = 240, cy = 160, r = 120;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <svg viewBox="0 0 480 320" className="w-full mx-auto" aria-label="Relationship map preview">
      <defs>
        {/* Center glow */}
        <radialGradient id="rmp-center-glow">
          <stop offset="0%" stopColor="rgba(139,92,246,0.25)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0)" />
        </radialGradient>
        {/* Line gradients per person */}
        {PEOPLE.map((n) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy + r * Math.sin(rad);
          return (
            <linearGradient key={`grad-${n.label}`} id={`rmp-line-${n.label}`} x1={cx} y1={cy} x2={x} y2={y} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={accentColor(n.strength, 0.35)} />
              <stop offset="100%" stopColor={accentColor(n.strength, 0.08)} />
            </linearGradient>
          );
        })}
      </defs>

      {/* Center ambient glow */}
      <circle cx={cx} cy={cy} r={50} fill="url(#rmp-center-glow)" />

      {/* Lines from center to each person */}
      {PEOPLE.map((n) => {
        const rad = (n.angle * Math.PI) / 180;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);
        return (
          <line
            key={`line-${n.label}`}
            x1={cx} y1={cy} x2={x} y2={y}
            stroke={`url(#rmp-line-${n.label})`}
            strokeWidth={1.5}
            className="transition-all duration-700"
            style={{ opacity: mounted ? 1 : 0 }}
          />
        );
      })}

      {/* Center node (You) */}
      <circle
        cx={cx} cy={cy} r={10}
        fill="rgba(139,92,246,0.9)"
        className="transition-all duration-500"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'scale(1)' : 'scale(0.5)',
          transformOrigin: `${cx}px ${cy}px`,
          filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.5))',
        }}
      />
      <text x={cx} y={cy + 24} fontSize="10" fill="rgba(139,92,246,0.45)" textAnchor="middle" fontFamily="monospace">
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
              fill={accentColor(n.strength, n.strength * 0.15)}
              stroke={accentColor(n.strength, n.strength * 0.5)}
              strokeWidth={1}
              style={{ filter: `drop-shadow(0 0 4px ${accentColor(n.strength, 0.2)})` }}
            />
            <text
              x={x} y={y - 12}
              fontSize="11"
              fill={accentColor(n.strength, n.strength * 0.7)}
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
