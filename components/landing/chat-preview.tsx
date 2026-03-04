'use client';

export function ChatPreview() {
  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-xl p-8 md:p-10 space-y-4">
      {/* User bubble */}
      <div className="ml-auto max-w-[80%] animate-fade-in">
        <div className="border border-white/20 rounded-xl px-5 py-4">
          <span className="font-mono text-[11px] text-white/45 uppercase tracking-[0.2em] block mb-2">You</span>
          <p className="text-[15px] text-white leading-[1.6]">
            Why doesn&apos;t my mom respect my boundaries?
          </p>
        </div>
      </div>

      {/* Assistant bubble */}
      <div className="mr-auto max-w-full animate-fade-in delay-200">
        <div className="border border-white/10 bg-white/[0.02] rounded-xl px-5 py-4">
          <span className="font-mono text-[11px] text-white/45 uppercase tracking-[0.2em] block mb-2">DEFRAG</span>
          <p className="text-[15px] text-white/70 leading-[1.6]">
            She may interpret distance as rejection rather than independence. The pattern tends to intensify when expectations shift quickly.
          </p>
        </div>
      </div>
    </div>
  );
}
