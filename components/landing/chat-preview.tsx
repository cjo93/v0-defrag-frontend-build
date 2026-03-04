'use client';

export function ChatPreview() {
  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-sm p-6 space-y-4">
      <div className="ml-auto max-w-[80%]">
        <div className="bg-white/[0.06] px-4 py-3 rounded-sm">
          <p className="text-[14px] text-white leading-[1.6]">
            Why doesn&apos;t my mom respect my boundaries?
          </p>
        </div>
      </div>
      <div className="mr-auto max-w-full">
        <div className="bg-white/[0.02] px-4 py-3 rounded-sm">
          <p className="text-[14px] text-white/70 leading-[1.6]">
            She may interpret distance as rejection rather than independence. The pattern intensifies when expectations shift quickly.
          </p>
        </div>
      </div>
    </div>
  );
}
