import Link from "next/link";

export const metadata = {
  title: "About — DEFRAG",
  description: "DEFRAG is a relational intelligence platform that maps the invisible dynamics behind your hardest relationships.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans antialiased">
      <div className="mx-auto max-w-[720px] px-6 md:px-10 py-24 md:py-32">
        <Link
          href="/"
          className="inline-block text-[14px] font-bold tracking-[0.2em] text-white/90 uppercase mb-16"
        >
          DEFRAG
        </Link>

        <h1 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-6">
          About DEFRAG
        </h1>

        <div className="space-y-8 text-[16px] text-white/55 leading-[1.85]">
          <p className="text-[18px] text-white/65 leading-[1.75]">
            DEFRAG is a relational intelligence platform. It maps the invisible dynamics behind your
            hardest relationships and tells you exactly what to do next.
          </p>

          <p>
            Most tools for understanding relationships ask you to talk about your feelings. DEFRAG works
            differently. It combines structured birth data, timing patterns, and the context you provide
            to build a living model of your interpersonal dynamics.
          </p>

          <p>
            The result: specific, actionable clarity. Not vague advice. Not personality labels. Real
            insight into why the same patterns keep repeating, and what you can actually do about it.
          </p>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-2xl p-7 md:p-8 my-10">
            <h2 className="text-[18px] font-semibold text-white/85 mb-4">What DEFRAG is not</h2>
            <ul className="space-y-3 text-[15px] text-white/50">
              <li className="flex items-start gap-3">
                <span className="text-white/20 mt-0.5 shrink-0">&mdash;</span>
                Not a social network. No feeds, no followers, no public profiles.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white/20 mt-0.5 shrink-0">&mdash;</span>
                Not therapy. We complement professional support, never replace it.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white/20 mt-0.5 shrink-0">&mdash;</span>
                Not a horoscope app. No daily fortune cookies. Structured analysis only.
              </li>
            </ul>
          </div>

          <p>
            DEFRAG is built by a small team that believes the hardest problems in life are relational.
            Your career, your family, your partnerships, your sense of self — they all run through
            the quality of your relationships. We built DEFRAG to make those dynamics visible.
          </p>

          <p>
            Your data is private. You can delete everything at any time. We never share your information
            with third parties for advertising. Privacy is not a feature — it is the foundation.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06] flex gap-6">
          <Link href="/" className="text-[12px] uppercase tracking-[0.12em] text-white/25 hover:text-white/45 transition-colors duration-200">
            Home
          </Link>
          <Link href="/why" className="text-[12px] uppercase tracking-[0.12em] text-white/25 hover:text-white/45 transition-colors duration-200">
            Why we built this
          </Link>
          <Link href="/terms" className="text-[12px] uppercase tracking-[0.12em] text-white/25 hover:text-white/45 transition-colors duration-200">
            Terms
          </Link>
        </div>
      </div>
    </main>
  );
}
