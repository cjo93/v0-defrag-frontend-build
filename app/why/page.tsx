import Link from "next/link";

export const metadata = {
  title: "Why We Built DEFRAG",
  description: "The story behind DEFRAG — why relational intelligence matters and what drove us to build it.",
};

export default function WhyPage() {
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
          Why we built DEFRAG
        </h1>

        <div className="space-y-8 text-[16px] text-white/55 leading-[1.85]">
          <p className="text-[18px] text-white/65 leading-[1.75]">
            Because the hardest problems in life are not technical. They are relational.
          </p>

          <p>
            Every major decision you make is shaped by the people around you. Who you trust.
            Who triggers you. Who you lean on. Who you avoid. The quality of your life runs
            directly through the quality of those dynamics.
          </p>

          <p>
            And yet — there is no good tool for understanding them.
          </p>

          <p>
            Therapy helps, but it is slow and expensive. Personality tests give you labels,
            not strategies. Horoscope apps tell you what you want to hear. None of them map
            the actual dynamics between you and the specific people in your life.
          </p>

          <div className="border-l-2 border-white/[0.08] pl-6 my-10">
            <p className="text-[17px] text-white/60 leading-[1.8] italic">
              &ldquo;Why does every conversation with my mom end the same way?&rdquo;
              &ldquo;Why do I keep choosing the same type of partner?&rdquo;
              &ldquo;Why does my coworker trigger me and nobody else seems to notice?&rdquo;
            </p>
          </div>

          <p>
            These are the questions DEFRAG was built to answer. Not with feelings. Not with
            platitudes. With structured analysis of the relational patterns that shape your life.
          </p>

          <p>
            DEFRAG uses natal data, timing, and the context you share to build a living model
            of your relationships. It shows you where tension lives, when communication windows
            open, and what specific steps might actually shift a stuck dynamic.
          </p>

          <p>
            We are not replacing therapists. We are not selling you a fortune. We are building
            the tool we wished existed when we were stuck in the same cycles, asking the same
            questions, and getting nowhere.
          </p>

          <p className="text-[18px] text-white/70 font-medium">
            DEFRAG exists because clarity should not be this hard to find.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06] flex gap-6">
          <Link href="/" className="text-[12px] uppercase tracking-[0.12em] text-white/25 hover:text-white/45 transition-colors duration-200">
            Home
          </Link>
          <Link href="/about" className="text-[12px] uppercase tracking-[0.12em] text-white/25 hover:text-white/45 transition-colors duration-200">
            About
          </Link>
          <Link href="/auth/signup" className="text-[12px] uppercase tracking-[0.12em] text-white/25 hover:text-white/45 transition-colors duration-200">
            Get started
          </Link>
        </div>
      </div>
    </main>
  );
}
