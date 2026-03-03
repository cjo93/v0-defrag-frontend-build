'use client'

export default function WhatWeBelieve() {
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
          What We Believe
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(18px, 2vw, 24px)',
            lineHeight: 1.4,
            color: 'var(--text-primary)',
            margin: '0 0 48px',
            fontWeight: 500,
          }}
        >
          Human difference is not dysfunction.
        </p>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            marginBottom: 48,
          }}
        >
          {[
            'Some people process emotion outwardly.',
            'Some process inwardly.',
            'Some move quickly.',
            'Some need time.',
          ].map((point, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 24,
                fontFamily: 'var(--font-sans)',
                fontSize: 18,
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
              }}
            >
              <div
                style={{
                  marginTop: 6,
                  width: 8,
                  height: 8,
                  border: '1px solid #ffffff',
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
          When we misread each other, tension grows.
          <br /><br />
          When structure is visible, tension decreases.
          <br /><br />
          <span style={{ color: 'var(--text-primary)' }}>Relational awareness should not require crisis to develop.</span>
          <br /><br />
          <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>It should be basic competence.</strong>
        </p>
      </div>
    </section>
  )
}
