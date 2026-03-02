'use client'

import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      })

      if (!res.ok) throw new Error('Failed to generate response')

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', data }])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'assistant', error: 'System error. Unable to process request.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: 800, margin: '0 auto' }}>
      <header style={{ borderBottom: '1px solid var(--line-mid)', paddingBottom: 24, marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 32, fontWeight: 500, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Structural Guidance
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Describe a tense interaction. DEFRAG will map the pattern.
        </p>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 40 }}>
        {messages.length === 0 && (
          <div style={{ padding: 32, border: '1px solid var(--line-mid)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--text-secondary)' }}>[ SYSTEM READY ]</span>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-muted)' }}>
              Example: "My partner walked out when we started talking about the schedule again."
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: msg.role === 'user' ? '80%' : '100%' }}>
            {msg.role === 'user' ? (
              <div style={{ background: '#fff', color: '#000', padding: '16px 24px', fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.4 }}>
                {msg.content}
              </div>
            ) : (
              <div style={{ border: '1px solid var(--line-mid)', padding: 32, display: 'flex', flexDirection: 'column', gap: 24, background: 'var(--panel-black)' }}>
                {msg.error ? (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-risk)' }}>[ ERROR: {msg.error} ]</span>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--line-low)', paddingBottom: 16 }}>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 500, margin: 0, lineHeight: 1.3 }}>
                        {msg.data.headline}
                      </h3>
                      <div style={{ padding: '4px 8px', border: '1px solid #fff', fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase' }}>
                        {msg.data.signal.label}
                      </div>
                    </div>

                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: 12 }}>What's Happening</span>
                      <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {msg.data.whats_happening.map((bullet: string, i: number) => (
                          <li key={i} style={{ display: 'flex', gap: 16, fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.4 }}>
                            <span style={{ marginTop: 6, width: 6, height: 6, background: '#fff', flexShrink: 0 }} />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block' }}>Do This Now</span>
                      <div style={{ background: '#fff', color: '#000', padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                        {msg.data.do_this_now}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block' }}>Say This</span>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, borderLeft: '2px solid #fff', paddingLeft: 16, margin: 0, fontStyle: 'italic' }}>
                        "{msg.data.one_line_to_say}"
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', padding: 16, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
            [ COMPUTING STRUCTURAL RESPONSE... ]
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ position: 'relative', marginTop: 'auto' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          placeholder="Enter scenario details..."
          style={{
            width: '100%',
            padding: '24px 80px 24px 24px',
            background: '#000',
            border: '1px solid #fff',
            color: '#fff',
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            outline: 'none',
          }}
          onFocus={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
          onBlur={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
            bottom: 8,
            padding: '0 24px',
            background: input.trim() ? '#fff' : 'transparent',
            color: input.trim() ? '#000' : 'var(--text-secondary)',
            border: input.trim() ? 'none' : '1px solid var(--line-mid)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontWeight: 600,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.1s'
          }}
        >
          Send
        </button>
      </form>
    </div>
  )
}
