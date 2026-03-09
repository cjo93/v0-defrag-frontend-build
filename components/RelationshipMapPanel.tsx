import Link from 'next/link';

export default function RelationshipMapPanel() {
  return (
    <section className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
      <h2 className="text-2xl font-medium mb-2">Relationship Map</h2>
      <p className="text-white/70 mb-4">See your active dynamics, signals, and connection state in one system view.</p>
      <Link href="/relationships" className="inline-flex h-10 px-4 items-center border border-white/20 hover:border-white/40 transition-colors">
        Open map
      </Link>
    </section>
  );
}
