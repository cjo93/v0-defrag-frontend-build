export default function PrinciplesPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans antialiased">
      <div className="max-w-[800px] mx-auto px-6 py-32">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-[-0.02em] text-white mb-6">
          Principles
        </h1>
        <p className="text-[17px] md:text-[20px] text-white/70 leading-[1.6] mb-12 max-w-[640px]">
          DEFRAG is built on pattern clarity, privacy, and practical action. We surface relationship dynamics so people can respond with less friction and more signal.
        </p>

        <a
          href="/"
          className="font-mono text-[12px] uppercase tracking-[0.12em] text-white/40 hover:text-white/60 transition-colors"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}
