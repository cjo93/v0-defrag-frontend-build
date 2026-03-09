'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section
      style={{
        padding: '160px 24px 80px',
        maxWidth: 1440,
        margin: '0 auto',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      className="hero-content"
    >
      <div style={{ maxWidth: '860px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(48px, 6vw, 96px)',
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            margin: '0 0 24px',
            color: 'var(--text-primary)',
            fontWeight: 500,
            textTransform: 'uppercase',
          }}
        >
          Understand why it keeps happening.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(20px, 2.4vw, 28px)',
            lineHeight: 1.4,
            color: 'var(--text-secondary)',
            margin: '0 0 48px',
            maxWidth: '700px',
          }}
        >
          See the system behind your relationships.
          <br /><br />
          DEFRAG reveals recurring patterns, timing pressure, and escalation signals so you can respond with clarity.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link
            href="/auth/signup"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 56,
              padding: '0 28px',
              background: '#ffffff',
              color: '#000000',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Start Free — No Card Required
          </Link>

          <Link
            href="/auth/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 56,
              padding: '0 28px',
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--line-mid)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Open DEFRAG
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hero-content {
            padding: 120px 24px 72px !important;
          }
        }
      `}</style>
    </section>
  )
}
