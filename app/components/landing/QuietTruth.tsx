'use client'

export default function QuietTruth() {
  return (
    <section
      id="quiet-truth"
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
          A Quiet Truth
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
          Most arguments repeat for the same reason.
          <br /><br />
          Not because of the topic.
          <br /><br />
          Because of how people react under pressure.
        </p>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            marginBottom: 48,
          }}
        >
          {[
            'One person pushes for clarity.',
            'Another pulls back to protect themselves.',
            'One raises intensity to fix the problem.',
            'The other lowers energy to stay safe.',
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
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(18px, 2vw, 24px)',
            lineHeight: 1.4,
            color: 'var(--text-secondary)',
            margin: '0',
          }}
        >
          Neither intends harm.
          <br /><br />
          Without visibility, the same loop repeats.
          <br /><br />
          <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>DEFRAG makes the loop visible.</strong>
        </p>
      </div>
    </section>
  )
}
