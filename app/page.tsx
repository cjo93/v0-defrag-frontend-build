import Hero from './components/Hero'

export default function LandingPage() {
  return (
    <main
      style={{
        background: 'var(--bg-black)',
        minHeight: '100vh',
        color: 'var(--text-primary)',
      }}
    >
      <Hero />
    </main>
  )
}
