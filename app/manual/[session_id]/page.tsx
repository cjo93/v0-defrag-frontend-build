'use client'

import { useEffect, useState } from 'react'

export default function ManualPlaceholderPage({ params }: { params: { session_id: string } }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Rigid, computed-style progress bar loading state
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
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-black)',
        color: '#fff',
        fontFamily: 'var(--font-mono)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 400, width: '100%' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24, color: 'var(--text-secondary)' }}>
          Session: {params.session_id.split('-')[0]}***
        </p>

        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 32, fontWeight: 500, margin: '0 0 40px', letterSpacing: '-0.02em' }}>
          Generating manual...
        </h1>

        <div style={{ width: '100%', height: 2, background: 'var(--line-low)', position: 'relative' }}>
           <div
             style={{
               position: 'absolute',
               top: 0,
               left: 0,
               height: '100%',
               width: `${progress}%`,
               background: '#fff',
               transition: 'width 0.1s linear' // Sharp movement, not smooth bezier
             }}
           />
        </div>

        <p style={{ marginTop: 24, fontSize: 12, color: 'var(--text-muted)' }}>
          {progress < 100 ? (
            <span>Computing structural patterns [ {progress}% ]</span>
          ) : (
            <span>Computation complete. Standing by for Phase 2.</span>
          )}
        </p>
      </div>
    </div>
  )
}
