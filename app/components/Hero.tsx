'use client'

import Link from 'next/link'
import ReticleOverlay from './ReticleOverlay'
import DiagnosticPanel from './DiagnosticPanel'

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--bg-black)',
        overflow: 'hidden',
      }}
    >
      {/* Wireframe grid background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 80px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Reticle overlay */}
      <ReticleOverlay />

      {/* Navigation bar */}
      <nav
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: 1440,
          margin: '0 auto',
          padding: '28px 48px',
          borderBottom: '1px solid rgba(255,255,255,0.10)',
        }}
        aria-label="Main navigation"
      >
        <span
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 12,
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.90)',
            textTransform: 'uppercase',
          }}
        >
          DEFRAG
        </span>
        <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
          {['Structure', 'Blueprint', 'Protocol'].map((item) => (
            <Link
              key={item}
              href={item === 'Blueprint' ? '/blueprint' : '#'}
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 10,
                letterSpacing: '0.14em',
                color: 'rgba(255,255,255,0.40)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color =
                  'rgba(255,255,255,0.85)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color =
                  'rgba(255,255,255,0.40)'
              }}
            >
              {item}
            </Link>
          ))}
        </div>
      </nav>

      {/* Hero content */}
      <div
        className="hero-content"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 1440,
          margin: '0 auto',
          padding: '140px 48px 120px',
          display: 'flex',
          gap: 80,
          alignItems: 'flex-start',
        }}
      >
        {/* Left column — 58% */}
        <div className="hero-left" style={{ flex: '0 0 58%', minWidth: 0 }}>
          {/* Microline */}
          <p
            className="blur-reveal"
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              letterSpacing: '0.20em',
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              marginBottom: 40,
              margin: '0 0 40px',
            }}
          >
            Blueprint&nbsp;&nbsp;·&nbsp;&nbsp;Protection&nbsp;&nbsp;·&nbsp;&nbsp;Interaction
          </p>

          {/* Headline */}
          <h1
            className="blur-reveal"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 'clamp(40px, 5.5vw, 84px)',
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 36px',
              fontWeight: 400,
            }}
          >
            Structure Governs What Repeats.
          </h1>

          {/* Subhead */}
          <p
            className="blur-reveal delay-120"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 'clamp(16px, 1.5vw, 20px)',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.82)',
              margin: '0 0 56px',
              maxWidth: 540,
            }}
          >
            DEFRAG reveals the structural blueprint beneath conflict, authority,
            and reinforcement.
          </p>

          {/* CTA group */}
          <div
            className="blur-reveal delay-450"
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
          >
            <Link
              href="/blueprint"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 52,
                padding: '0 36px',
                background: '#ffffff',
                color: '#000000',
                fontFamily: "'Courier New', monospace",
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                border: '1px solid #ffffff',
                transition: 'background 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = '#000'
                el.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = '#fff'
                el.style.color = '#000'
              }}
            >
              Run Structural Analysis
            </Link>

            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 52,
                padding: '0 36px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.60)',
                fontFamily: "'Courier New', monospace",
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'border-color 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = 'rgba(255,255,255,0.40)'
                el.style.color = 'rgba(255,255,255,0.85)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = 'rgba(255,255,255,0.15)'
                el.style.color = 'rgba(255,255,255,0.60)'
              }}
            >
              View Protocol
            </a>
          </div>

          {/* Divider + status row */}
          <div
            style={{
              marginTop: 72,
              paddingTop: 28,
              borderTop: '1px solid rgba(255,255,255,0.10)',
              display: 'flex',
              gap: 48,
            }}
          >
            {[
              { label: 'Framework Status', value: 'Active' },
              { label: 'Analysis Mode', value: 'Structural' },
              { label: 'Output', value: 'Blueprint' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: 9,
                    letterSpacing: '0.16em',
                    color: 'rgba(255,255,255,0.28)',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: 11,
                    letterSpacing: '0.10em',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — 42% */}
        <div className="hero-right" style={{ flex: '0 0 42%', minWidth: 0, paddingTop: 8 }}>
          <DiagnosticPanel />
        </div>
      </div>

      {/* Mobile styles */}
      <style>{`
        @media (max-width: 860px) {
          .hero-content {
            flex-direction: column !important;
            padding: 80px 24px 80px !important;
            gap: 48px !important;
          }
          .hero-left, .hero-right {
            flex: unset !important;
            width: 100% !important;
          }
        }
        @media (max-width: 540px) {
          .hero-content {
            padding: 60px 20px 60px !important;
          }
        }
      `}</style>
    </section>
  )
}
