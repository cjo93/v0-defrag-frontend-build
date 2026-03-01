export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif mb-2">Session History</h1>
        <p className="font-sans text-white/60 text-sm">Log of previous computations.</p>
      </div>

      <div className="border border-white/12 overflow-hidden">
        <div className="p-4 border-b border-white/12 bg-white/5 font-sans text-xs uppercase tracking-widest text-white/60">
          Recent Activity
        </div>
        <div className="p-8 text-center text-white/40 font-mono text-sm">
          [ No records found ]
        </div>
      </div>
    </div>
  )
}
