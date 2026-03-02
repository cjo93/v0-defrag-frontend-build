'use client'

import Link from 'next/link'

export default function Hero() {
  const scrollToBuild = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('build-module')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--bg-black)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* TODO: Replace radial gradient with high-resolution 3D render of heavy metal mechanism (Ending the Era of Apology asset) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(30,30,30,0.4) 0%, rgba(0,0,0,1) 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(var(--line-low) 0px, var(--line-low) 1px, transparent 1px, transparent 120px), repeating-linear-gradient(90deg, var(--line-low) 0px, var(--line-low) 1px, transparent 1px, transparent 120px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Navigation bar */}
      <nav
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: 1440,
          width: '100%',
          margin: '0 auto',
          padding: '28px 48px',
          borderBottom: '1px solid var(--line-low)',
        }}
        aria-label="Main navigation"
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.90)',
            textTransform: 'uppercase',
          }}
        >
          DEFRAG
        </span>
      </nav>

      {/* Hero content */}
      <div
        className="hero-content"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 1440,
          width: '100%',
          margin: 'auto auto',
          padding: '140px 48px 120px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(48px, 6vw, 100px)',
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            margin: '0 0 24px',
            fontWeight: 500,
            maxWidth: '18ch',
          }}
        >
          You’re not broken. You’re running a pattern.
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(18px, 2vw, 24px)',
            lineHeight: 1.4,
            color: 'var(--text-secondary)',
            margin: '0 0 48px',
            maxWidth: '48ch',
            fontWeight: 400,
          }}
        >
          DEFRAG is a secure AI platform that maps how you operate — alone, under stress, and with other people.
          <br /><br />
          No journaling. No “how do you feel?”<br />
          Just the pure mechanics of your nervous system.
        </p>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <a
            href="#build-module"
            onClick={scrollToBuild}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 56,
              padding: '0 40px',
              background: '#ffffff',
              color: '#000000',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
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

          <a
            href="#how-it-works"
            onClick={scrollToHowItWorks}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 56,
              padding: '0 24px',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              transition: 'color 0.2s, border-color 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = '#ffffff'
              el.style.borderBottom = '1px solid #ffffff'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = 'var(--text-secondary)'
              el.style.borderBottom = '1px solid transparent'
            }}
          >
            See How It Works
          </a>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.02em',
            color: 'var(--text-secondary)',
            marginTop: 24,
            textTransform: 'uppercase',
          }}
        >
          Built for individuals, couples, and teams. Birth time optional.
        </p>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hero-content {
            padding: 80px 24px 80px !important;
          }
        }
      `}</style>
    </section>
  )
}
