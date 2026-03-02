export default function RelationalPreview() {
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
          See the loop. Interrupt it.
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
          When two stress responses collide, patterns repeat.
          DEFRAG shows:
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
          {['The loop forming', 'Who escalates / who withdraws', 'Where to interrupt first', 'How to stabilize the system'].map((point, i) => (
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

        {/* Relational Loop Preview */}
        <div
          style={{
            border: '1px solid var(--line-mid)',
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: 40,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
               <div style={{ width: 48, height: 48, background: '#fff' }} />
               <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>User A</span>
             </div>

             {/* The Loop Line */}
             <div style={{ flex: 1, height: 1, background: 'var(--line-mid)', position: 'relative', margin: '0 24px' }}>
                <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', width: 32, height: 32, border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, lineHeight: 1 }}>×</span>
                </div>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
               <div style={{ width: 48, height: 48, border: '2px solid #fff' }} />
               <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>User B</span>
             </div>
          </div>

          <div style={{ borderTop: '1px solid var(--line-low)', paddingTop: 24 }}>
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
              Loop Summary
            </span>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 20, margin: 0, lineHeight: 1.4 }}>
              Your urgency increases their withdrawal.
            </p>
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
              Interrupt First
            </span>
            <div style={{ background: '#fff', display: 'inline-block', padding: '8px 16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#000', fontWeight: 600, textTransform: 'uppercase' }}>
                Lower intensity before asking for closeness.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
