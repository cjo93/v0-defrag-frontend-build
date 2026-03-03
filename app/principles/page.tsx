'use client'

import Link from 'next/link'

export default function PrinciplesPage() {
  return (
    <main
      style={{
        background: 'var(--bg-black)',
        minHeight: '100vh',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        padding: '160px 24px',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
          Principles
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            lineHeight: 1.4,
            color: 'var(--text-secondary)',
            margin: '0 0 48px',
          }}
        >
          The deeper logic of DEFRAG. Coming soon.
        </p>
        <Link
          href="/"
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
          Return Home
        </Link>
      </div>
    </main>
  )
}
