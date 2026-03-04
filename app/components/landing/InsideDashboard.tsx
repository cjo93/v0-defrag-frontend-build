'use client'

export default function InsideDashboard() {
  const sections = [
    { title: 'AI Guidance', desc: 'Private, structured answers to real-world situations.' },
    { title: 'Relationship View', desc: 'See who may be sensitive today and where tension has appeared before.' },
    { title: 'Daily Brief', desc: 'A short private audio overview of relational tone and timing.' },
    { title: 'Learn', desc: 'Clear explanations of how escalation works and how to interrupt it safely.' },
  ]

  return (
    <section className="landing-section">
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
          Inside the Dashboard
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
          After login, you enter four areas:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, marginBottom: 80 }}>
          {sections.map((section, i) => (
            <div key={i} style={{ borderLeft: '1px solid var(--line-mid)', paddingLeft: 32 }}>
              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 24,
                  lineHeight: 1.3,
                  fontWeight: 500,
                  margin: '0 0 8px',
                  color: 'var(--text-primary)'
                }}
              >
                {section.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 18,
                  lineHeight: 1.4,
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                {section.desc}
              </p>
            </div>
          ))}
        </div>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            margin: '0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          Nothing abstract.
          <br />
          Nothing inflated.
          <br />
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Just visibility.</span>
        </p>

      </div>
    </section>
  )
}
