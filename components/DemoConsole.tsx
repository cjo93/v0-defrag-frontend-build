import Link from 'next/link';

export default function DemoConsole() {
  return (
    <section className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
      <h2 className="text-2xl font-medium mb-2">Try DEFRAG</h2>
      <p className="text-white/70 mb-4">Use chat and daily briefings to understand repeating conflict patterns.</p>
      <Link href="/chat" className="inline-flex h-10 px-4 items-center border border-white/20 hover:border-white/40 transition-colors">
        Open chat
      </Link>
    </section>
  );
}
