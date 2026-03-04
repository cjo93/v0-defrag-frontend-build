'use client';

export function DashboardPreview() {
  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-xl p-8 md:p-10 space-y-4">
      {/* Today row */}
      <div className="flex items-center gap-4 border border-white/[0.06] bg-white/[0.02] rounded-lg px-5 py-4 hover:bg-white/[0.04] transition-colors duration-200">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50 w-16 shrink-0">
          Today
        </span>
        <div className="h-[1px] flex-1 bg-white/[0.08]" />
        <span className="text-[14px] text-white/55">Pressure window: <span className="text-white/80">calm</span></span>
      </div>

      {/* People row */}
      <div className="flex items-center gap-4 border border-white/[0.06] bg-white/[0.02] rounded-lg px-5 py-4 hover:bg-white/[0.04] transition-colors duration-200">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50 w-16 shrink-0">
          People
        </span>
        <div className="h-[1px] flex-1 bg-white/[0.08]" />
        <span className="text-[14px] text-white/55">Mom — <span className="text-white/80">tension rising</span></span>
      </div>

      {/* Ask row */}
      <div className="flex items-center gap-4 border border-white/[0.06] bg-white/[0.02] rounded-lg px-5 py-4 hover:bg-white/[0.04] transition-colors duration-200">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50 w-16 shrink-0">
          Ask
        </span>
        <div className="h-[1px] flex-1 bg-white/[0.08]" />
        <span className="text-[14px] text-white/55 italic">Why does my dad push so hard?</span>
      </div>
    </div>
  );
}
