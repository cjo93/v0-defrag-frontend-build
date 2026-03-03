import { Hero } from './components/layout/Hero'
import { Section } from './components/layout/Section'
import { Card } from './components/layout/Card'

export default function LandingPage() {
  return (
    <>
      <Hero />

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
          <Card title="Live Family Map">
            Analyze historical relational data to predict structural risk. No guesswork.
          </Card>
          <Card title="Daily Listen">
            Capture friction points before they cascade. Real-time signal tracking.
          </Card>
          <Card title="Learn">
            Study your own loops. A library of your structural weaknesses.
          </Card>
          <Card title="AI Chat">
            Speak to a system trained on your relationships. Objective reflection only.
          </Card>
        </div>
      </Section>
    </>
  )
}
