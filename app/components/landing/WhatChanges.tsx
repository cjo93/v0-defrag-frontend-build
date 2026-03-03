'use client'

export default function WhatChanges() {
  return (
    <section
      style={{
        padding: '140px 24px',
        maxWidth: 1440,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 64,
        background: 'var(--bg-black)',
        borderTop: '1px solid var(--line-mid)',
      }}
    >
      <div style={{ maxWidth: '640px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(32px, 4vw, 56px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: '0 0 24px',
            fontWeight: 500,
            color: 'var(--text-primary)'
          }}
        >
          What Changes
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(18px, 2vw, 24px)',
            lineHeight: 1.4,
            color: 'var(--text-secondary)',
            margin: '0 0 48px',
          }}
        >
          You begin noticing earlier:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 64 }}>
          {['“I’m escalating because I feel dismissed.”', '“They’re overwhelmed, not ignoring me.”', '“This isn’t the right moment.”'].map((q, i) => (
            <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)' }}>
              {q}
            </div>
          ))}
        </div>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            marginBottom: 64,
          }}
        >
          {[
            'You wait instead of pushing.',
            'You lower tone instead of raising it.',
            'You give space instead of absorbing stress.',
          ].map((point, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 24,
                fontFamily: 'var(--font-sans)',
                fontSize: 18,
                color: 'var(--text-primary)',
                lineHeight: 1.4,
              }}
            >
              <div
                style={{
                  marginTop: 6,
                  width: 8,
                  height: 8,
                  background: '#ffffff',
                  flexShrink: 0,
                }}
              />
              {point}
            </li>
          ))}
        </ul>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(18px, 2vw, 24px)',
            lineHeight: 1.4,
            color: 'var(--text-secondary)',
            margin: '0',
          }}
        >
          Most damage happens in moments.
          <br /><br />
          <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Most moments are visible when you know what to look for.</strong>
        </p>

      </div>
    </section>
  )
}
