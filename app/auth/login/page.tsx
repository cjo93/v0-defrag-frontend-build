'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // In Phase 1 MVP, we prioritize Magic Links for passwordless entry
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://defrag.app'

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/app/dashboard`,
      },
    })

    if (error) {
      alert(error.message)
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '16px',
    background: '#000',
    border: '1px solid #fff',
    color: '#fff',
    fontFamily: 'var(--font-mono)',
    fontSize: 14,
    outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-black)', padding: 24 }}>
      <div style={{ maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 32, fontWeight: 500, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            System Access
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Secure login. Encrypted storage.
          </p>
        </div>

        {sent ? (
          <div style={{ padding: 24, border: '1px solid var(--line-mid)', background: 'var(--panel-black)' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: '#fff' }}>
              Authentication link dispatched.
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
              Check your email for the secure login link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="identity@domain.com"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '20px',
                background: loading ? '#333' : '#fff',
                color: loading ? '#888' : '#000',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Processing...' : 'Send Secure Link'}
            </button>
          </form>
        )}

        <div style={{ borderTop: '1px solid var(--line-mid)', paddingTop: 24, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            New to DEFRAG? <Link href="/" style={{ color: '#fff', textDecoration: 'underline', marginLeft: 8 }}>Generate a baseline</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
