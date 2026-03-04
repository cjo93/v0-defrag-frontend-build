'use client';

export function DashboardPreview() {
  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-sm p-6 space-y-0">
      {[  
        { name: 'Mom', state: 'strained' },
        { name: 'Dad', state: 'stable' },
        { name: 'Sister', state: 'improving' },
      ].map((row) => (
        <div key={row.name} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
          <span className="text-[14px] text-white/70">{row.name}</span>
          <span className="text-[12px] text-white/50">{row.state}</span>
        </div>
      ))}
    </div>
  );
}
