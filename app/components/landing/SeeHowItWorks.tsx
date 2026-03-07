'use client'

import Link from 'next/link'
import { InsightCard } from '@/components/ui/insight-card'
import type { DefragInsightCard } from '@/lib/types'

const demoCard: DefragInsightCard = {
  title: "What DEFRAG notices",
  insight: "You may sometimes carry more responsibility than anyone asked for.\n\nOver time that can quietly become identity.",
  pattern: "Over-responsibility",
  tone: ["Pressure", "fatigue"],
  shadow: "over-responsibility", // drives the shadow color (defaulting if not matched)
  gift: "Boundaries",
  reframe: "Responsibility is powerful.\n\nBut balance appears when weight is shared.",
  next_step: "Ask yourself today:\n\nWhat am I holding that is not actually mine?",
  confidence: 85
}

export default function SeeHowItWorks() {
  return (
    <section
      className="landing-section"
      id="see-how-it-works"
      style={{
        padding: '140px 24px',
        maxWidth: 1440,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        borderTop: '1px solid var(--line-mid)',
      }}
    >
      <div style={{ maxWidth: '800px', marginBottom: '64px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: '0 0 24px',
            color: 'var(--text-primary)',
            fontWeight: 500,
          }}
        >
          See How Defrag Works
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(18px, 2vw, 24px)',
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
            margin: '0 auto',
            maxWidth: '640px',
          }}
        >
          Defrag listens for patterns across your natal chart, live planetary movement, and the themes emerging in your life.
          <br /><br />
          When something meaningful appears, it surfaces insight like this.
        </p>
      </div>

      <div className="w-full max-w-lg mx-auto">
        <InsightCard card={demoCard} />
      </div>

      <div style={{ marginTop: '64px' }}>
        <Link
          href="/auth/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 56,
            padding: '0 32px',
            background: '#ffffff',
            color: '#000000',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Try Defrag
        </Link>
      </div>
    </section>
  )
}
