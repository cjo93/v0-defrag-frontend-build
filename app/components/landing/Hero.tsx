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
      <div style={{ maxWidth: '800px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(48px, 6vw, 100px)',
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            margin: '0 0 24px',
            color: 'var(--text-primary)',
            fontWeight: 500,
          }}
        >
          Conflict is predictable.<br />
          <span style={{ color: 'var(--text-secondary)' }}>Damage doesn’t have to be.</span>
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            lineHeight: 1.4,
            color: 'var(--text-secondary)',
            margin: '0 0 48px',
            maxWidth: '640px',
          }}
        >
          DEFRAG helps you understand what’s happening in tense moments — before they escalate.
          <br /><br />
          Timing. Reaction. Pattern.
          <br /><br />
          <span style={{ color: 'var(--text-primary)' }}>Clear enough to change the outcome.</span>
        </p>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link
            href="/auth/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 56,
              padding: '0 32px',
              background: '#ffffff',
              color: '#000000',
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

          <a
            href="#quiet-truth"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('quiet-truth')?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 56,
              padding: '0 32px',
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--line-mid)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = '#ffffff'
              el.style.borderColor = '#ffffff'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = 'var(--text-secondary)'
              el.style.borderColor = 'var(--line-mid)'
            }}
          >
            See How It Works
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hero-content {
            padding: 120px 24px 80px !important;
          }
        }
      `}</style>
    </section>
  )
}
