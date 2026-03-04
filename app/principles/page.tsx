'use client'

import Link from 'next/link'

export default function PrinciplesPage() {
  return (
    <main className="min-h-screen bg-transparent text-white font-sans antialiased flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[920px]">
        <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-4">Philosophy</p>
        <h1 className="text-[36px] md:text-[56px] font-normal tracking-[-0.025em] leading-[1.02] mb-5">
          Principles
        </h1>
        <p className="text-[17px] md:text-[20px] text-white/70 leading-[1.6] mb-12 max-w-[640px]">
          The deeper logic of DEFRAG. Coming soon.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-[48px] px-9 border border-white/25 text-white/80 rounded-sm font-mono text-[13px] font-semibold uppercase tracking-[0.08em] hover:text-white hover:border-white/50 transition-all duration-200"
        >
          Return Home
        </Link>
      </div>
    </main>
  )
}
