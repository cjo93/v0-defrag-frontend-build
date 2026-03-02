import Hero from './components/landing/Hero'
import TrustStrip from './components/landing/TrustStrip'
import ValueProp from './components/landing/ValueProp'
import BuildModule from './components/landing/BuildModule'
import ManualPreview from './components/landing/ManualPreview'
import RelationalPreview from './components/landing/RelationalPreview'
import TimingPreview from './components/landing/TimingPreview'
import FinalCTA from './components/landing/FinalCTA'

export default function LandingPage() {
  return (
    <main
      style={{
        background: 'var(--bg-black)',
        minHeight: '100vh',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Hero />
      <TrustStrip />
      <ValueProp />
      <BuildModule />
      <ManualPreview />
      <RelationalPreview />
      <TimingPreview />
      <FinalCTA />
    </main>
  )
}
