'use client'

export default function TimingMatters() {
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
          Timing Matters
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
          Some days, small disagreements spiral.
          <br /><br />
          Other days, conversations land easily.
          <br /><br />
          <span style={{ color: 'var(--text-primary)' }}>DEFRAG calculates when sensitivity is likely to be higher — before conflict begins.</span>
          <br /><br />
          This doesn’t predict the future.
          <br /><br />
          <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>It gives you leverage.</strong>
        </p>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(18px, 2vw, 24px)',
            lineHeight: 1.4,
            color: 'var(--text-secondary)',
            margin: '0 0 48px',
          }}
        >
          You can:
        </p>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            marginBottom: 64,
          }}
        >
          {[
            'Keep requests shorter',
            'Delay high-stakes conversations',
            'Lower intensity',
            'Step back when needed',
          ].map((point, i) => (
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
                  border: '1px solid #ffffff',
                  flexShrink: 0,
                }}
              />
              {point}
            </li>
          ))}
        </ul>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(18px, 2vw, 24px)',
            lineHeight: 1.4,
            color: 'var(--text-secondary)',
            margin: '0',
          }}
        >
          <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Prepared conversations go differently.</strong>
        </p>
      </div>
    </section>
  )
}
