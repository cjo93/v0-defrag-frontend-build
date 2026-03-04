"use client";

import PersonNode from "@/components/person-node";

type Person = {
  id: string;
  name: string;
  relationship_label: string | null;
  privacy_level: string;
};

export default function RelationshipMap({
  people,
  onAddPerson,
}: {
  people: Person[];
  onAddPerson: () => void;
}) {
  if (people.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-5">
        <div className="w-20 h-20 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center">
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-white/25">
            You
          </span>
        </div>
        <div className="text-center space-y-2 max-w-[280px]">
          <p className="text-[16px] text-white/50 leading-[1.6]">
            Your relational map is empty.
          </p>
          <p className="text-[13px] text-white/30 leading-[1.6]">
            Add someone to begin understanding the dynamics between you.
          </p>
        </div>
        <button
          onClick={onAddPerson}
          className="inline-flex items-center justify-center h-[44px] px-6 border border-white/25 text-white/80 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:text-white hover:border-white/50 active:scale-[0.98] transition-all duration-200 ease-out"
        >
          Add person
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[520px] flex items-center justify-center animate-fade-in">
      {/* SVG connection lines */}
      <svg
        className="absolute pointer-events-none"
        style={{
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
        }}
      >
        <g
          transform={`translate(${50}%, ${50}%)`}
          style={{ transform: "translate(50%, 50%)" }}
        >
          {people.map((person, index) => {
            const radius = 200;
            const angle =
              ((2 * Math.PI) / people.length) * index - Math.PI / 2;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            return (
              <line
                key={person.id}
                x1={0}
                y1={0}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
            );
          })}
        </g>
      </svg>

      {/* Center node — YOU */}
      <div className="absolute z-10 w-16 h-16 rounded-full border border-white/20 bg-white/[0.05] flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.04)]">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
          You
        </span>
      </div>

      {/* Person nodes */}
      {people.map((person, index) => (
        <PersonNode
          key={person.id}
          person={person}
          index={index}
          total={people.length}
        />
      ))}
    </div>
  );
}
