'use client';

export default function ArchitectureDiagram() {
  return (
    <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--line-low)' }}>
      <svg width="100%" height="48" viewBox="0 0 420 48" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true">
        <style>
          {`
            @keyframes loop-pulse {
              0% { opacity: 0.16; }
              50% { opacity: 0.22; }
              100% { opacity: 0.16; }
            }
            .loop-arc { animation: loop-pulse 5s infinite ease-in-out; }
          `}
        </style>

        <rect x="0" y="16" width="100" height="16" stroke="rgba(255,255,255,0.16)" strokeWidth="1" fill="none" />
        <text x="50" y="28" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace" letterSpacing="0.08em">BLUEPRINT</text>

        <line x1="100" y1="24" x2="158" y2="24" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
        <polygon points="158,20 166,24 158,28" fill="rgba(255,255,255,0.16)" />

        <rect x="166" y="16" width="90" height="16" stroke="rgba(255,255,255,0.16)" strokeWidth="1" fill="none" />
        <text x="211" y="28" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace" letterSpacing="0.08em">PROTECTION</text>

        <line x1="256" y1="24" x2="314" y2="24" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
        <polygon points="314,20 322,24 314,28" fill="rgba(255,255,255,0.16)" />

        <rect x="322" y="16" width="98" height="16" stroke="rgba(255,255,255,0.16)" strokeWidth="1" fill="none" />
        <text x="371" y="28" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace" letterSpacing="0.08em">LOOP CONTINUITY</text>

        <path className="loop-arc" d="M 420 24 C 430 24 430 44 371 44 C 312 44 312 44 50 44 C -10 44 -10 24 0 24" stroke="rgba(255,255,255,0.16)" strokeWidth="1" strokeDasharray="3 4" fill="none" />
      </svg>
    </div>
  );
}
