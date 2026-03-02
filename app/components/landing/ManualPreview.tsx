export default function ManualPreview() {
  return (
    <section
      style={{
        padding: '140px 48px',
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
            fontSize: 'clamp(28px, 3.5vw, 48px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: '0 0 24px',
            fontWeight: 500,
          }}
        >
          This isn’t a personality report.<br />
          It’s a clear breakdown of how you operate under pressure.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(18px, 2vw, 24px)',
            lineHeight: 1.4,
            color: 'var(--text-secondary)',
            margin: '0 0 64px',
          }}
        >
          Each insight includes:
        </p>

        <ol
          style={{
            listStyle: 'decimal',
            paddingLeft: 24,
            margin: '0 0 80px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            fontFamily: 'var(--font-sans)',
            fontSize: 18,
            color: 'var(--text-primary)',
          }}
        >
          <li>What’s happening</li>
          <li>What to do</li>
          <li style={{ color: 'var(--text-secondary)' }}>Why this happens (tap to expand)</li>
        </ol>

        {/* Insight Card Component Preview */}
        <div
          style={{
            border: '1px solid #fff',
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
            position: 'relative',
          }}
        >
          {/* Static structural diagram top right */}
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 24,
              height: 24,
              border: '1px solid var(--line-mid)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 12, height: 1, background: '#fff', transform: 'rotate(45deg)' }} />
          </div>

          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginBottom: 8,
                display: 'block',
              }}
            >
              Primary Insight
            </span>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 24,
                lineHeight: 1.3,
                fontWeight: 500,
                margin: 0,
              }}
            >
              You escalate when connection feels unstable.
            </p>
          </div>

          <div>
            <div
              style={{
                display: 'inline-block',
                background: '#fff',
                padding: '8px 16px',
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: '#000',
                  fontWeight: 600,
                }}
              >
                Drop your volume by 10% before stating your need.
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--line-low)', paddingTop: 16 }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)' }}>[+]</span> Why this happens
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
