export default function TimingPreview() {
  const signals = [
    { type: 'low', label: 'Low-pressure day. Good for direct conversation.', icon: '[ - ]' },
    { type: 'med', label: 'Medium pressure. Observe before initiating.', icon: '[ = ]' },
    { type: 'high', label: 'High sensitivity window. Lead gently.', icon: '[ ! ]' },
  ]

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
            fontSize: 'clamp(32px, 4vw, 56px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: '0 0 24px',
            fontWeight: 500,
          }}
        >
          Timing changes everything.
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
          Some windows amplify sensitivity. Some support repair.
          <br /><br />
          You won’t see charts. You’ll see simple signals like:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {signals.map((signal, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                padding: '24px',
                border: '1px solid var(--line-mid)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 16,
                  color: signal.type === 'high' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  width: 48,
                  textAlign: 'center',
                }}
              >
                {signal.icon}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 18,
                  color: 'var(--text-primary)',
                  lineHeight: 1.4,
                }}
              >
                {signal.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
