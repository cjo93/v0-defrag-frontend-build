import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Principles | DEFRAG',
  description: 'The principles behind DEFRAG.',
};

export default function PrinciplesPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-24 md:py-32 selection:bg-white selection:text-black">
      <div className="max-w-2xl mx-auto space-y-16">
        <header className="space-y-4 border-b border-white/20 pb-8">
          <h1 className="text-2xl md:text-3xl font-mono tracking-tight uppercase">
            /principles
          </h1>
          <h2 className="text-lg text-zinc-400 font-mono tracking-tight">
            The Principles Behind DEFRAG
          </h2>
        </header>

        <section className="space-y-6">
          <h3 className="text-xl font-mono tracking-tight uppercase">
            1. Difference Is Structural
          </h3>
          <div className="space-y-4 text-zinc-300 font-mono text-sm leading-relaxed">
            <p>People are not broken.</p>
            <p>They are built differently.</p>
            <p>Some people move quickly when something feels uncertain.<br/>
            Some slow down to regain stability.</p>
            <p>Some process emotion outwardly.<br/>
            Some process internally before speaking.</p>
            <p>These differences are not flaws.</p>
            <p>They are structural variations in how people handle pressure.</p>
            <p>Conflict often begins when those differences are misread.</p>
          </div>
        </section>

        <hr className="border-white/20" />

        <section className="space-y-6">
          <h3 className="text-xl font-mono tracking-tight uppercase">
            2. Pressure Changes Behavior
          </h3>
          <div className="space-y-4 text-zinc-300 font-mono text-sm leading-relaxed">
            <p>Most people behave differently under stress.</p>
            <p>When pressure rises:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Some increase intensity</li>
              <li>Some withdraw</li>
              <li>Some try to fix</li>
              <li>Some try to avoid</li>
            </ul>
            <p>These reactions are not random.</p>
            <p>They are patterned.</p>
            <p>If you can see the pattern early, you can interrupt it before it escalates.</p>
            <p>DEFRAG focuses on identifying these pressure responses — not labeling personality.</p>
          </div>
        </section>

        <hr className="border-white/20" />

        <section className="space-y-6">
          <h3 className="text-xl font-mono tracking-tight uppercase">
            3. Timing Matters More Than Intention
          </h3>
          <div className="space-y-4 text-zinc-300 font-mono text-sm leading-relaxed">
            <p>Two people can both have good intentions and still collide.</p>
            <p>Often, the issue is not what is being said.</p>
            <p>It is when it is being said.</p>
            <p>Some conversations require steadiness.<br/>
            Some require space.<br/>
            Some require delay.</p>
            <p>The right conversation at the wrong time creates unnecessary damage.</p>
            <p>Timing awareness reduces escalation.</p>
          </div>
        </section>

        <hr className="border-white/20" />

        <section className="space-y-6">
          <h3 className="text-xl font-mono tracking-tight uppercase">
            4. Repetition Is Data
          </h3>
          <div className="space-y-4 text-zinc-300 font-mono text-sm leading-relaxed">
            <p>When a dynamic repeats, it is not coincidence.</p>
            <p>It is information.</p>
            <p>Recurring tension is usually driven by:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Reaction speed differences</li>
              <li>Protection strategies</li>
              <li>Stress levels</li>
              <li>Environmental pressure</li>
            </ul>
            <p>Most people only notice the topic.</p>
            <p>We look at the pattern underneath it.</p>
          </div>
        </section>

        <hr className="border-white/20" />

        <section className="space-y-6">
          <h3 className="text-xl font-mono tracking-tight uppercase">
            5. Awareness Reduces Harm
          </h3>
          <div className="space-y-4 text-zinc-300 font-mono text-sm leading-relaxed">
            <p>Relational damage usually happens in moments.</p>
            <p>Moments can be predicted more often than people think.</p>
            <p>When someone can see:</p>
            <p className="pl-4 border-l border-white/20 italic">
              &quot;I am escalating because I feel dismissed.&quot;<br/>
              &quot;They are withdrawing because they feel overwhelmed.&quot;
            </p>
            <p>The outcome changes.</p>
            <p>Not because anyone was fixed.</p>
            <p>Because the moment was handled differently.</p>
          </div>
        </section>

        <hr className="border-white/20" />

        <section className="space-y-6">
          <h3 className="text-xl font-mono tracking-tight uppercase">
            6. Technology Should Clarify, Not Inflate
          </h3>
          <div className="space-y-4 text-zinc-300 font-mono text-sm leading-relaxed">
            <p>DEFRAG uses structured modeling and AI synthesis to translate complex signals into simple guidance.</p>
            <p>The system measures reaction patterns and timing sensitivity.</p>
            <p>It does not diagnose.<br/>
            It does not predict destiny.<br/>
            It does not replace therapy.</p>
            <p>It provides visibility.</p>
            <p>Technology should reduce confusion — not increase it.</p>
          </div>
        </section>

        <hr className="border-white/20" />

        <section className="space-y-6">
          <h3 className="text-xl font-mono tracking-tight uppercase">
            7. Privacy Is Non-Negotiable
          </h3>
          <div className="space-y-4 text-zinc-300 font-mono text-sm leading-relaxed">
            <p>Relational information is sensitive.</p>
            <p>DEFRAG is built with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Encrypted storage</li>
              <li>Secure processing</li>
              <li>User-controlled deletion</li>
              <li>Clear limitations</li>
            </ul>
            <p>Trust is not a feature.<br/>
            It is a requirement.</p>
          </div>
        </section>

        <hr className="border-white/20" />

        <section className="space-y-6">
          <h3 className="text-xl font-mono tracking-tight uppercase">
            8. Relational Intelligence Is Becoming Standard
          </h3>
          <div className="space-y-4 text-zinc-300 font-mono text-sm leading-relaxed">
            <p>Financial literacy became standard.<br/>
            Physical health tracking became standard.<br/>
            Digital security became standard.</p>
            <p>Relational awareness is next.</p>
            <p>Understanding:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Reaction patterns</li>
              <li>Sensitivity levels</li>
              <li>Timing windows</li>
            </ul>
            <p>Should not require crisis.</p>
            <p>It should be basic competence.</p>
          </div>
        </section>

        <hr className="border-white/20" />

        <section className="space-y-6 pb-12">
          <h3 className="text-xl font-mono tracking-tight uppercase">
            Closing
          </h3>
          <div className="space-y-4 text-zinc-300 font-mono text-sm leading-relaxed">
            <p>DEFRAG exists to make structure visible.</p>
            <p>Not to judge it.<br/>
            Not to fix people.<br/>
            Not to assign labels.</p>
            <p>To reduce unnecessary damage.</p>
            <p>When structure is visible, tension decreases.</p>
            <p>That is the principle.</p>
          </div>
        </section>

        <div className="pt-8 border-t border-white/20">
          <Link
            href="/"
            className="text-xs font-mono tracking-widest uppercase hover:text-white text-zinc-400 transition-colors"
          >
            ← Return to Index
          </Link>
        </div>
      </div>
    </main>
  );
}
