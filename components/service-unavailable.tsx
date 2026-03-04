'use client';

export function ServiceUnavailable() {
  const buildSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'LOCAL';
  const buildDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-transparent text-white font-sans antialiased flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-sm animate-fade-in space-y-4 text-center">
        <p className="font-mono text-[13px] font-semibold tracking-[0.2em] text-white">DEFRAG</p>
        <h1 className="text-[22px] font-normal tracking-[-0.015em]">Service temporarily unavailable</h1>
        <p className="text-[14px] text-white/50 leading-relaxed">
          Missing configuration. Please try again shortly.
        </p>
        <p className="font-mono text-[10px] text-white/25 tracking-[0.1em] pt-4">
          {buildDate} / {buildSha.slice(0, 7)}
        </p>
      </div>
    </div>
  );
}
