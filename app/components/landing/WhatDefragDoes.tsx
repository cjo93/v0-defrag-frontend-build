'use client'

export default function WhatDefragDoes() {
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
          What DEFRAG Does
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
          Inside a real moment, you can ask:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 64 }}>
          {['“Is this a good time to bring this up?”', '“Why did that escalate so fast?”', '“Should I keep pushing?”'].map((q, i) => (
            <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)' }}>
              {q}
            </div>
          ))}
        </div>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(18px, 2vw, 24px)',
            lineHeight: 1.4,
            color: 'var(--text-secondary)',
            margin: '0 0 48px',
          }}
        >
          You receive:
        </p>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            marginBottom: 80,
          }}
        >
          {['A clear summary of what’s happening', 'Today’s sensitivity level', 'A confidence score', 'One immediate adjustment', 'One sentence that lowers defensiveness'].map((point, i) => (
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

        {/* Example Block */}
        <div style={{ border: '1px solid var(--line-mid)', padding: 40, background: 'var(--panel-black)' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              marginBottom: 24,
              display: 'block',
            }}
          >
            Example Output
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 18, color: 'var(--text-primary)' }}>Sensitivity is elevated.</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 18, color: 'var(--text-primary)' }}>Escalation risk is moderate.</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 18, color: 'var(--text-primary)' }}>Lower tone before asking for clarity.</div>
          </div>

          <div style={{ borderTop: '1px solid var(--line-low)', paddingTop: 24 }}>
             <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginBottom: 16,
                display: 'block',
              }}
            >
              Try saying
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: '#fff', background: '#222', padding: 16, borderLeft: '2px solid #fff' }}>
              “I’m not trying to rush this. I just want to understand.”
            </div>
          </div>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(18px, 2vw, 24px)',
            lineHeight: 1.4,
            color: 'var(--text-secondary)',
            margin: '64px 0 0',
          }}
        >
          Small shift.
          <br />
          <span style={{ color: 'var(--text-primary)' }}>Different outcome.</span>
        </p>

      </div>
    </section>
  )
}
