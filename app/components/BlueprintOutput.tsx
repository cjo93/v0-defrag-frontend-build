'use client'

import JsonSignalBlock from './JsonSignalBlock'

export default function BlueprintOutput() {
  return (
    <div style={{ background: 'var(--bg-black)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '80px 48px', position: 'relative' }}>

        {/* Radial Schematic */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 0 }}>
          <svg width="600" height="600" viewBox="0 0 600 600" fill="none" opacity="0.03">
            <circle cx="300" cy="300" r="60" stroke="white" strokeWidth="1" />
            <circle cx="300" cy="300" r="120" stroke="white" strokeWidth="1" />
            <circle cx="300" cy="300" r="200" stroke="white" strokeWidth="1" />
            <circle cx="300" cy="300" r="280" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="blur-reveal delay-0">
            <h1 style={{ fontFamily: 'serif', fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 400, margin: '0 0 16px' }}>
              Structural Orientation: Defined.
            </h1>
            <p style={{ fontFamily: 'serif', fontSize: '18px', color: 'var(--text-secondary)', margin: 0 }}>
              Your system maintains internal authority under pressure.
            </p>
          </div>

          <div style={{ width: '100%', height: 1, background: 'var(--line-low)', margin: '56px 0' }} />

          {/* Baseline Structure */}
          <section className="blur-reveal delay-120" style={{ marginBottom: '56px' }}>
            <h2 style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '28px' }}>
              Baseline Structure
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {['Authority Processing', 'Clarity Seeking', 'Stabilization Tendency'].map((label, i) => (
                <div key={i} style={{ padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '28px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>{`0${i + 1}`}</span>
                  <div>
                    <p style={{ fontFamily: 'monospace', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div style={{ width: '100%', height: 1, background: 'var(--line-low)', marginBottom: '48px' }} />

          {/* Defense Configuration */}
          <section className="blur-reveal delay-320" style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '20px' }}>
              Defense Configuration
            </h2>
            <p style={{ fontFamily: 'serif', fontSize: '17px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Under load, your system increases control to restore order.
            </p>
            <div style={{ display: 'inline-block', border: '1px solid var(--line-mid)', padding: '10px 18px', background: 'var(--panel-black)' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
                Protection Bias: Control-Seeking
              </span>
            </div>
          </section>

          <div style={{ width: '100%', height: 1, background: 'var(--line-low)', marginBottom: '48px' }} />

          {/* Reinforcement Analysis */}
          <section className="blur-reveal delay-450" style={{ marginBottom: '56px' }}>
            <h2 style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '20px' }}>
              Reinforcement Analysis
            </h2>
            <p style={{ fontFamily: 'serif', fontSize: '17px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              When paired with high emotional amplification, clarity intensifies defense.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid var(--line-mid)', padding: '16px 20px', background: 'var(--panel-black)' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Loop Probability</span>
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--accent-risk)', fontWeight: 500 }}>Moderate</span>
            </div>
          </section>

          <JsonSignalBlock />
        </div>
      </div>
    </div>
  )
}
