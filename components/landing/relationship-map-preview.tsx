'use client';

export function RelationshipMapPreview() {
  const cx = 160, cy = 120, r = 90;
  const nodes = [
    { label: 'Mom', angle: -90 },
    { label: 'Dad', angle: 30 },
    { label: 'Sister', angle: 150 },
  ];

  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-sm p-6">
      <svg viewBox="0 0 320 240" className="w-full max-w-[320px] mx-auto">
        {nodes.map((n) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy + r * Math.sin(rad);
          return (
            <line key={n.label} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          );
        })}
        <circle cx={cx} cy={cy} r={8} fill="white" />
        {nodes.map((n) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy + r * Math.sin(rad);
          return (
            <g key={n.label}>
              <circle cx={x} cy={y} r={5} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.35)" strokeWidth={1} />
              <text x={x} y={y + 16} fontSize="11" fill="rgba(255,255,255,0.55)" textAnchor="middle">{n.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
