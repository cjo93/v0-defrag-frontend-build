'use client';

function PreviewPanel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-5 md:p-6 rounded-sm">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35 mb-4">{label}</p>
      {children}
    </div>
  );
}

export function DashboardPreview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <PreviewPanel label="Today">
        <div className="space-y-3">
          <p className="text-[14px] text-white/70 leading-relaxed">Mom's pattern intensifies around holidays — expect tension by Thursday.</p>
          <p className="text-[13px] text-white/40">Last update: 2 hours ago</p>
        </div>
      </PreviewPanel>

      <PreviewPanel label="Relationship Field">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {['strained', 'stable', 'improving', 'stable'].map((s, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: s === 'strained' ? 'rgba(255,255,255,0.5)' : s === 'improving' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
          <span className="text-[13px] text-white/40">4 people tracked</span>
        </div>
      </PreviewPanel>

      <PreviewPanel label="People">
        <div className="space-y-0">
          {[
            { name: 'Mom', state: 'strained' },
            { name: 'Partner', state: 'stable' },
            { name: 'Sister', state: 'improving' },
          ].map((row) => (
            <div key={row.name} className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-b-0">
              <span className="text-[14px] text-white/65">{row.name}</span>
              <span className="text-[12px] text-white/35">{row.state}</span>
            </div>
          ))}
        </div>
      </PreviewPanel>

      <PreviewPanel label="Ask DEFRAG">
        <div className="space-y-3">
          <div className="border border-white/[0.06] bg-white/[0.01] rounded-sm px-4 py-3">
            <p className="text-[13px] text-white/30 italic">Why does my mom get defensive when I set boundaries?</p>
          </div>
          <p className="text-[12px] text-white/30">Context-aware relationship Q&amp;A</p>
        </div>
      </PreviewPanel>
    </div>
  );
}
