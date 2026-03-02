'use client';

export default function ReticleOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        overflow: 'hidden', zIndex: 1, opacity: 0.05,
      }}
    >
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: '#fff', transform: 'translateX(-50%)' }} />
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#fff', transform: 'translateY(-50%)' }} />

      {/* Corner Crosshairs */}
      <svg style={{ position: 'absolute', top: 32, left: 32 }} width="24" height="24" viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="0" x2="12" y2="8" stroke="white" strokeWidth="1" />
        <line x1="0" y1="12" x2="8" y2="12" stroke="white" strokeWidth="1" />
      </svg>
      <svg style={{ position: 'absolute', top: 32, right: 32 }} width="24" height="24" viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="0" x2="12" y2="8" stroke="white" strokeWidth="1" />
        <line x1="16" y1="12" x2="24" y2="12" stroke="white" strokeWidth="1" />
      </svg>
      <svg style={{ position: 'absolute', bottom: 32, left: 32 }} width="24" height="24" viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="16" x2="12" y2="24" stroke="white" strokeWidth="1" />
        <line x1="0" y1="12" x2="8" y2="12" stroke="white" strokeWidth="1" />
      </svg>
      <svg style={{ position: 'absolute', bottom: 32, right: 32 }} width="24" height="24" viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="16" x2="12" y2="24" stroke="white" strokeWidth="1" />
        <line x1="16" y1="12" x2="24" y2="12" stroke="white" strokeWidth="1" />
      </svg>
    </div>
  );
}
