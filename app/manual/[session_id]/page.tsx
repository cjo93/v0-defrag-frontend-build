'use client'

import { useEffect, useState } from 'react'

export default function ManualPlaceholderPage({ params }: { params: { session_id: string } }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const blocks = [10, 25, 45, 80, 100]
    let current = 0
    const interval = setInterval(() => {
      setProgress(blocks[current])
      current++
      if (current >= blocks.length) {
        clearInterval(interval)
      }
    }, 600)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-6">
          Session: {params.session_id.split('-')[0]}***
        </p>

        <h1 className="text-[26px] md:text-[32px] font-normal tracking-[-0.02em] mb-10">
          Generating manual...
        </h1>

        <div className="w-full h-[2px] bg-white/[0.08] relative rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-white transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-5 font-mono text-[11px] md:text-[12px] text-white/45 tracking-[0.1em]">
          {progress < 100 ? (
            <span>Computing structural patterns [ {progress}% ]</span>
          ) : (
            <span>Processing complete. Standing by for Engine Phase 2.</span>
          )}
        </p>
      </div>
    </div>
  )
}
