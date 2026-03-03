'use client'

import Link from 'next/link'

export default function FinalCTA() {
  const scrollToBuild = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('build-module')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      style={{
        padding: '140px 48px',
        maxWidth: 1440,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: 'var(--bg-black)',
        borderTop: '1px solid var(--line-mid)',
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
        Open your Manual. Stop guessing.
      </h2>

      <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <a
          href="#build-module"
          onClick={scrollToBuild}
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
          Open My Manual
        </a>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.04em',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
          }}
        >
          Secure processing. Plain-English output. Delete anytime.
        </p>
      </div>

      {/* Footer minimal */}
      <footer
        style={{
          marginTop: 140,
          width: '100%',
          borderTop: '1px solid var(--line-low)',
          paddingTop: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
          DEFRAG © {new Date().getFullYear()}
        </span>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link
            href="#"
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
            Why DEFRAG
          </Link>
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
            href="#"
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
            About
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
