export default function TrustStrip() {
  const items = [
    { label: 'Secure by design', icon: <div style={{ width: 12, height: 12, border: '1px solid #fff' }} /> },
    { label: 'Encrypted processing', icon: <div style={{ width: 12, height: 12, background: '#fff' }} /> },
    { label: 'Offline AI synthesis', icon: <div style={{ width: 12, height: 12, border: '1px solid #fff' }} /> },
    { label: 'Structured outputs (no AI drift)', icon: <div style={{ width: 16, height: 1, background: '#fff' }} /> },
    { label: 'Zero psychological profiling', icon: <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1px solid #fff' }} /> }, // Although circles are generally avoided, a stark geometric hollow circle fits the brutalist data vibe, or we use a square. Let's stick to square.
  ];

  items[4].icon = <div style={{ width: 12, height: 12, borderTop: '1px solid #fff', borderBottom: '1px solid #fff' }} />

  return (
    <div
      style={{
        borderTop: '1px solid var(--line-mid)',
        borderBottom: '1px solid var(--line-mid)',
        background: 'var(--panel-black)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: '24px 32px',
              borderRight: idx !== items.length - 1 ? '1px solid var(--line-low)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            {item.icon}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.04em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="padding: 24px 32px"] {
            border-right: none !important;
            border-bottom: 1px solid var(--line-low) !important;
          }
          div[style*="padding: 24px 32px"]:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
    </div>
  )
}
