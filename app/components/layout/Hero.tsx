import { Button } from './Button';
import { Diagram } from './Diagram';

export function Hero() {
  return (
    <section className="pt-hero pb-[160px] relative overflow-hidden flex items-center justify-center min-h-[600px] border-b border-borderSubtle">
      <Diagram />
      <div className="max-w-container mx-auto px-lg text-center z-10 relative">
        <h1 className="text-hero mb-2xl font-sans tracking-tight text-textPrimary leading-none">
          The standard for handling conflict.
        </h1>

        <p className="text-lead text-textSecondary max-w-reading mx-auto">
          DEFRAG helps you understand what&apos;s happening in a tense moment — before it turns into damage.
        </p>

        <div className="mt-3xl flex justify-center gap-lg">
          <Button variant="primary">
            Enter DEFRAG
          </Button>
          <Button variant="secondary">
            See How It Works
          </Button>
        </div>
      </div>
    </section>
  );
}
