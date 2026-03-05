'use client';

export function ChatPreview() {
  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-sm p-6 md:p-8 space-y-5">
      {/* User message */}
      <div className="ml-auto max-w-[85%]">
        <div className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded-sm">
          <p className="text-[14px] text-white/90 leading-relaxed">
            Why doesn&apos;t my mom respect my boundaries?
          </p>
        </div>
        <p className="text-[11px] text-white/25 text-right mt-1.5">You</p>
      </div>

      {/* Assistant message */}
      <div className="mr-auto max-w-[92%]">
        <div className="bg-white/[0.05] border border-white/10 px-4 py-3 rounded-sm">
          <p className="text-[14px] text-white/70 leading-relaxed">
            She may interpret distance as rejection rather than independence. The pattern intensifies when expectations shift quickly. A calmer opening might be: <span className="text-white/50 italic">&quot;I need some space — it&apos;s not about you.&quot;</span>
          </p>
        </div>
        <p className="text-[11px] text-white/25 mt-1.5">DEFRAG</p>
      </div>
    </div>
  );
}
