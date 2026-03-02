export default function ValueProp() {
  const points = [
    'Your default stress response',
    'What you protect under pressure',
    'How your conflict loops form (and how to break them)',
    'Where to interrupt early',
    'How pressure moves through groups and families',
  ]

  return (
    <section
      id="how-it-works"
      style={{
        padding: '140px 48px',
        maxWidth: 1440,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 64,
        background: 'var(--bg-black)',
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
          }}
        >
          Stop guessing. Start interrupting.
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
          DEFRAG maps:
        </p>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {points.map((point, i) => (
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

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.04em',
            color: 'var(--text-secondary)',
            marginTop: 64,
            textTransform: 'uppercase',
            borderTop: '1px solid var(--line-low)',
            paddingTop: 24,
          }}
        >
          Clear insight first. Depth when you want it.
        </p>
      </div>

      <style>{`
        @media (max-width: 860px) {
          section[id="how-it-works"] {
            padding: 80px 24px !important;
          }
        }
      `}</style>
    </section>
  )
}
