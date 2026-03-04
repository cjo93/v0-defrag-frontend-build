'use client';

export function RelationshipMapPreview() {
  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-xl p-8 md:p-10">
      <div className="flex flex-col items-center">
        {/* Map visual */}
        <div className="relative w-full max-w-[320px] h-[240px]">
          {/* Center node — You */}
          <div className="absolute left-1/2 top-6 -translate-x-1/2 z-10">
            <div className="border border-white/20 bg-white/[0.03] px-4 py-2 rounded-lg font-mono text-[12px] text-white/80 animate-pulse-slow">
              You
            </div>
          </div>

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 240" fill="none">
            <line x1="160" y1="50" x2="80" y2="140" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="160" y1="50" x2="240" y2="140" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="80" y1="140" x2="120" y2="210" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          </svg>

          {/* Mom node */}
          <div className="absolute left-[10%] top-[52%]">
            <div className="border border-white/20 bg-white/[0.03] px-4 py-2 rounded-lg font-mono text-[12px] text-white/60">
              Mom
            </div>
          </div>

          {/* Dad node */}
          <div className="absolute right-[10%] top-[52%]">
            <div className="border border-white/20 bg-white/[0.03] px-4 py-2 rounded-lg font-mono text-[12px] text-white/60">
              Dad
            </div>
          </div>

          {/* Sister node */}
          <div className="absolute left-[25%] bottom-0">
            <div className="border border-white/20 bg-white/[0.03] px-4 py-2 rounded-lg font-mono text-[12px] text-white/60">
              Sister
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
