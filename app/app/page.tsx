export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif mb-2">Overview</h1>
        <p className="font-sans text-white/60 text-sm">System telemetry and current status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-white/12 p-6">
          <div className="font-sans text-xs text-white/60 uppercase tracking-widest mb-4">Baseline Status</div>
          <div className="font-mono text-sm text-white/90">Pending Initialization</div>
        </div>

        <div className="border border-white/12 p-6">
          <div className="font-sans text-xs text-white/60 uppercase tracking-widest mb-4">Active Sequences</div>
          <div className="font-mono text-sm text-white/90">0</div>
        </div>
      </div>
    </div>
  )
}
