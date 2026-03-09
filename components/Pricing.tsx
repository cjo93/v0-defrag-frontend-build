import Link from 'next/link';

export default function Pricing() {
  return (
    <section className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
      <h2 className="text-2xl font-medium mb-2">Pricing</h2>
      <p className="text-white/70 mb-4">Choose a plan that matches your current relationship depth.</p>
      <Link href="/unlock" className="inline-flex h-10 px-4 items-center border border-white/20 hover:border-white/40 transition-colors">
        View plans
      </Link>
    </section>
  );
}
