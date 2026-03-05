'use client';

const PEOPLE = [
  { name: 'Mom', initials: 'M', state: 'strained', dot: 'bg-white/50' },
  { name: 'Partner', initials: 'P', state: 'cooling', dot: 'bg-white/30' },
  { name: 'Sister', initials: 'S', state: 'improving', dot: 'bg-white/80' },
];

export function HeroPreview() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] shadow-[0_8px_40px_rgba(0,0,0,0.4)] overflow-hidden">
      {/* Window chrome */}
      <div className="h-10 px-4 border-b border-white/[0.06] flex items-center">
        <div className="flex gap-[6px]">
          <div className="w-[10px] h-[10px] rounded-full bg-white/[0.07]" />
          <div className="w-[10px] h-[10px] rounded-full bg-white/[0.07]" />
          <div className="w-[10px] h-[10px] rounded-full bg-white/[0.07]" />
        </div>
        <span className="font-mono text-[10px] text-white/15 ml-auto tracking-wider">defrag.app</span>
      </div>

      {/* Tab bar */}
      <div className="px-5 flex gap-5 border-b border-white/[0.05]">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 py-2.5 border-b border-white/40 -mb-px">
          Today
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/15 py-2.5">
          History
        </span>
      </div>

      {/* People rows */}
      <div className="px-5 py-1">
        {PEOPLE.map((p, i) => (
          <div
            key={p.name}
            className={`flex items-center justify-between py-3.5 ${i < PEOPLE.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-white/[0.05] flex items-center justify-center ring-1 ring-white/[0.06]">
                <span className="text-[10px] text-white/35 font-medium">{p.initials}</span>
              </div>
              <span className="text-[13px] text-white/65 font-medium">{p.name}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className={`w-[5px] h-[5px] rounded-full ${p.dot}`} />
              <span className="font-mono text-[10px] text-white/30 tracking-wide">{p.state}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Ask input */}
      <div className="px-5 py-3.5 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="flex-1 bg-white/[0.025] border border-white/[0.06] rounded-lg px-3.5 py-2.5">
            <span className="text-[12px] text-white/20 italic">Why does Mom go quiet after visits?</span>
          </div>
          <div className="shrink-0 h-9 w-9 flex items-center justify-center bg-white/[0.06] rounded-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
