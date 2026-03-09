import Link from 'next/link';

export default function PrivacyPanel() {
  return (
    <section className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
      <h2 className="text-2xl font-medium mb-2">Privacy by design</h2>
      <p className="text-white/70 mb-4">Your relational data remains scoped to your account and protected by authenticated API access.</p>
      <Link href="/terms" className="text-sm text-white/80 underline underline-offset-4">Read terms & privacy controls</Link>
    </section>
  );
}
