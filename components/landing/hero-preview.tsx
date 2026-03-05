'use client';

const PEOPLE = [
  { name: 'Mom', state: 'strained', dot: 'bg-white/60' },
  { name: 'Partner', state: 'cooling', dot: 'bg-white/35' },
  { name: 'Sister', state: 'improving', dot: 'bg-white/20' },
];

export function HeroPreview() {
  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">Today</span>
        <span className="font-mono text-[10px] text-white/20">3 people</span>
      </div>

      {/* People rows */}
      <div className="px-5">
        {PEOPLE.map((p, i) => (
          <div
            key={p.name}
            className={`flex items-center justify-between py-3 ${i < PEOPLE.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
          >
            <span className="text-[13px] text-white/60">{p.name}</span>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
              <span className="font-mono text-[11px] text-white/30">{p.state}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Ask DEFRAG */}
      <div className="px-5 py-3.5 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="flex-1 border border-white/[0.06] bg-white/[0.01] rounded-sm px-3.5 py-2.5">
            <span className="text-[12px] text-white/25 italic">Why does Mom get defensive?</span>
          </div>
          <div className="shrink-0 h-[34px] px-3 flex items-center border border-white/[0.08] rounded-sm">
            <span className="font-mono text-[10px] text-white/30 uppercase tracking-wide">Ask</span>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-5 py-2.5 border-t border-white/[0.04]">
        <span className="font-mono text-[10px] text-white/20">Open dashboard &rarr;</span>
      </div>
    </div>
  );
}
