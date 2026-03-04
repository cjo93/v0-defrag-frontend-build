'use client'

import Link from 'next/link'

export default function FinalCTA() {
  const commitSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'local';
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || 'development';
  const timestamp = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || new Date().toISOString();

  return (
    <section
      className="landing-section"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(48px, 6vw, 100px)',
          lineHeight: 1.02,
          letterSpacing: '-0.03em',
          color: '#ffffff',
          margin: '0 0 24px',
          fontWeight: 500,
        }}
      >
        See the pattern.<br />Change the outcome.
      </h2>

      <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <Link
          href="/auth/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 64,
            padding: '0 48px',
            background: '#ffffff',
            color: '#000000',
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'transform 0.1s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.transform = 'translate(4px, 0)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.transform = 'translate(0, 0)'
          }}
        >
          Enter DEFRAG
        </Link>
      </div>

      <footer
        style={{
          marginTop: 140,
          width: '100%',
          borderTop: '1px solid var(--line-low)',
          paddingTop: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 24
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.1em',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
          }}
        >
          DEFRAG © {new Date().getFullYear()}<br />
          <span style={{ opacity: 0.5, marginTop: 4, display: 'inline-block' }}>Build: {commitSha} • {vercelEnv} • {timestamp}</span>
        </span>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link
            href="/principles"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.1em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = 'var(--text-secondary)';
            }}
          >
            Principles
          </Link>
          <Link
            href="/contact"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.1em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = 'var(--text-secondary)';
            }}
          >
            Contact
          </Link>
        </div>
      </footer>
    </section>
  )
}
