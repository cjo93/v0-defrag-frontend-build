'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type Person = {
  id: string;
  name: string;
  relationship_label?: string;
  relationship_state?: 'stable' | 'improving' | 'strained' | 'cooling' | 'unclear';
  pattern?: string;
  leverage?: {
    type: string;
    point: string;
    opening: string;
    move: string;
    line: string;
  };
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
  const [tappedId, setTappedId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  const [activeLeverageId, setActiveLeverageId] = useState<string | null>(null);

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
  const activeLeveragePerson = visible.find(p => p.id === activeLeverageId);

  const nodes = visible.map((person, i) => {
    const angle = angleStep * i - Math.PI / 2;
    return {
      ...person,
      x: CENTER + RADIUS * Math.cos(angle),
      y: CENTER + RADIUS * Math.sin(angle),
    };
  });

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-full relative gap-8">
      <div className="relative w-full max-w-[380px] shrink-0">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full"
          style={{ overflow: 'visible' }}
        >
          {/* Connection lines */}
          {nodes.map((node) => {
            const isHovered = hoveredId === node.id || activeLeverageId === node.id;
            const lev = node.leverage;

            // Apply line animation based on leverage type
            let lineClass = "";
            let strokeColor = isHovered ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.12)';

            if (lev?.type === 'timing') {
              lineClass = "animate-line-pulse";
              strokeColor = 'rgba(255,255,255,0.6)';
            } else if (lev?.type === 'pursuit_withdrawal') {
              lineClass = "animate-flow";
            } else if (lev?.type === 'boundary_signaling') {
              // We'll add a flare on the line using a small circle
            } else if (lev?.type === 'generational') {
              lineClass = "animate-mirrored";
            }

            return (
              <g key={`line-group-${node.id}`}>
                <line
                  x1={CENTER}
                  y1={CENTER}
                  x2={node.x}
                  y2={node.y}
                  stroke={strokeColor}
                  strokeWidth={isHovered ? 1.5 : 1}
                  className={lineClass}
                  style={{
                    opacity: mounted ? 1 : 0,
                    transition: 'opacity 300ms ease, stroke 200ms ease',
                  }}
                />

                {lev?.type === 'boundary_signaling' && isHovered && (
                  <circle
                    cx={CENTER + (node.x - CENTER) * 0.3}
                    cy={CENTER + (node.y - CENTER) * 0.3}
                    r={3}
                    fill="white"
                    className="animate-flare pointer-events-none"
                  />
                )}

                {lev?.type === 'pursuit_withdrawal' && (
                  <rect
                    x={CENTER + (node.x - CENTER) * 0.5 - 4}
                    y={CENTER + (node.y - CENTER) * 0.5 - 4}
                    width={8}
                    height={8}
                    fill="transparent"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth={1}
                    transform={`rotate(45 ${CENTER + (node.x - CENTER) * 0.5} ${CENTER + (node.y - CENTER) * 0.5})`}
                    className="pointer-events-none"
                  />
                )}
              </g>
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
            const isHovered = hoveredId === node.id || activeLeverageId === node.id;
            const delay = 80 + i * 40;
            const lev = node.leverage;

            let gClass = "cursor-pointer transition-all duration-300";
            if (lev?.type === 'role' && isHovered) {
              gClass += " animate-halo";
            }

            return (
              <g
                key={node.id}
                className={gClass}
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
                onClick={(e) => {
                  if (lev) {
                    setActiveLeverageId(node.id === activeLeverageId ? null : node.id);
                    e.preventDefault();
                    return;
                  }

                  if ('ontouchstart' in window) {
                    if (tappedId !== node.id) {
                      e.preventDefault();
                      setTappedId(node.id);
                      setHoveredId(node.id);
                      return;
                    }
                  }
                  router.push(`/chat?person_id=${node.id}`);
                }}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'scale(1)' : 'scale(0.92)',
                  transformOrigin: `${node.x}px ${node.y}px`,
                  transition: `opacity 200ms ease ${delay}ms, transform 200ms ease ${delay}ms`,
                  filter: isHovered ? 'drop-shadow(0 0 6px rgba(255,255,255,0.12))' : 'none',
                }}
              >
                {/* Leverage Marker Indicator */}
                {lev && (
                  <circle
                    cx={node.x}
                    cy={node.y - 18}
                    r={2}
                    fill="rgba(255,255,255,0.8)"
                    className={lev.type === 'timing' ? 'animate-pulse' : ''}
                  />
                )}

                {/* State ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 12 : 10}
                  fill={lev?.type === 'role' && isHovered ? 'rgba(255,255,255,0.1)' : 'none'}
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

                {/* Role label if applicable */}
                {lev?.type === 'role' && (
                  <text
                    x={node.x}
                    y={node.y - 25}
                    fontSize="9"
                    fill="rgba(255,255,255,0.4)"
                    textAnchor="middle"
                    className="select-none pointer-events-none uppercase tracking-widest font-mono"
                  >
                    REGULATOR
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip (Only if no active leverage panel) */}
        {hoveredPerson && tooltipPos && !activeLeveragePerson && (
          <div
            className="absolute pointer-events-none animate-fade-in z-10"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="border border-white/10 bg-white/[0.04] rounded-sm px-3 py-2 space-y-0.5 shadow-lg backdrop-blur-md">
              <p className="text-[13px] text-white font-medium whitespace-nowrap">{hoveredPerson.name}</p>
              {hoveredPerson.relationship_label && (
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.12em]">
                  {hoveredPerson.relationship_label}
                </p>
              )}
              <p className="font-mono text-[10px] text-white/50 uppercase tracking-[0.12em]">
                {STATE_LABEL[hoveredPerson.relationship_state ?? 'unclear']}
              </p>
              {hoveredPerson.leverage && (
                <p className="font-mono text-[10px] text-white/80 uppercase tracking-[0.12em] mt-1 pt-1 border-t border-white/10">
                  Leverage Found (Click)
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Active Leverage Side Panel */}
      {activeLeveragePerson && activeLeveragePerson.leverage && (
        <div className="w-full lg:w-[280px] shrink-0 border border-white/10 bg-white/[0.02] p-5 animate-fade-in relative z-20">
          <button
            onClick={() => setActiveLeverageId(null)}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 2L10 10M10 2L2 10" />
            </svg>
          </button>

          <div className="space-y-6">
            <div>
              <p className="text-[14px] text-white/70 font-medium mb-1">{activeLeveragePerson.name}</p>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse"></span>
                <p className="font-mono text-[10px] text-white/50 uppercase tracking-[0.15em]">System Leverage</p>
              </div>
            </div>

            <div className="space-y-4">
              {activeLeveragePerson.pattern && (
                <div>
                  <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.15em] mb-1">Active pattern</p>
                  <p className="text-[13px] text-white/80 capitalize">{activeLeveragePerson.pattern.replace('_', ' ')}</p>
                </div>
              )}

              <div>
                <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.15em] mb-1">Leverage point</p>
                <p className="text-[13px] text-white/80">{activeLeveragePerson.leverage.point}</p>
              </div>

              <div>
                <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.15em] mb-1">Best opening</p>
                <p className="text-[13px] text-white/80">{activeLeveragePerson.leverage.opening}</p>
              </div>

              <div>
                <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.15em] mb-1">One move</p>
                <p className="text-[13px] text-white/80">{activeLeveragePerson.leverage.move}</p>
              </div>

              <div className="bg-white/[0.04] border border-white/5 p-3 rounded-sm">
                <p className="font-mono text-[9px] text-white/40 uppercase tracking-[0.15em] mb-2">One line</p>
                <p className="text-[13px] text-white/90 italic leading-relaxed">"{activeLeveragePerson.leverage.line}"</p>
              </div>
            </div>

            <button
              onClick={() => router.push(`/chat?person_id=${activeLeveragePerson.id}`)}
              className="w-full h-10 border border-white/10 text-white/60 text-[11px] font-mono uppercase tracking-[0.1em] hover:text-white hover:border-white/30 transition-all duration-200"
            >
              Intervene →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
