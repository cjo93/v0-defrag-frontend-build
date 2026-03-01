export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif mb-2">System Parameters</h1>
        <p className="font-sans text-white/60 text-sm">Configure your account preferences.</p>
      </div>

      <div className="border border-white/12 p-8 space-y-6">
        <div>
          <label className="block font-sans text-xs uppercase tracking-widest text-white/60 mb-2">Data Source</label>
          <div className="font-mono text-sm border border-white/12 px-4 py-3 bg-white/5 text-white/40">
            Internal Vault (Encrypted)
          </div>
        </div>
      </div>
    </div>
  )
}
