'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { label: 'AI Chat', path: '/app/dashboard/chat', active: true },
    { label: 'Live Family Map', path: '/app/dashboard/map', active: false },
    { label: 'Daily Listen', path: '/app/dashboard/listen', active: false },
    { label: 'Learn', path: '/app/dashboard/learn', active: false },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)', color: '#fff', display: 'flex', flexDirection: 'column' }}>

      {/* Top Nav */}
      <nav style={{ borderBottom: '1px solid var(--line-mid)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          DEFRAG
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          Session: Active
        </div>
      </nav>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <aside style={{ width: 280, borderRight: '1px solid var(--line-mid)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '32px 24px', flex: 1 }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {navItems.map(item => (
                <li key={item.path}>
                  {item.active ? (
                    <Link
                      href={item.path}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        color: pathname.startsWith(item.path) ? '#000' : 'var(--text-secondary)',
                        background: pathname.startsWith(item.path) ? '#fff' : 'transparent',
                        border: '1px solid',
                        borderColor: pathname.startsWith(item.path) ? '#fff' : 'transparent',
                        transition: 'all 0.1s',
                      }}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: 'var(--line-mid)',
                        cursor: 'not-allowed',
                        userSelect: 'none'
                      }}
                    >
                      {item.label}
                      <span style={{ fontSize: 9 }}>[ Phase 2 ]</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 64, borderTop: '1px solid var(--line-low)', paddingTop: 24 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: 16 }}>
                Memory Controls
              </span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: 14, cursor: 'pointer', padding: 0 }}>
                    Pause Memory
                  </button>
                </li>
                <li>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: 14, cursor: 'pointer', padding: 0 }}>
                    Clear History (30 Days)
                  </button>
                </li>
              </ul>
            </div>

            <div style={{ marginTop: 24, borderTop: '1px solid var(--line-low)', paddingTop: 24 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: 16 }}>
                Data Rights
              </span>
              <button style={{ background: 'transparent', border: 'none', color: '#ff4444', fontFamily: 'var(--font-sans)', fontSize: 14, cursor: 'pointer', padding: 0 }}>
                Delete Account & Data
              </button>
            </div>
          </div>

          <div style={{ padding: 24, borderTop: '1px solid var(--line-mid)' }}>
             <button
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--line-mid)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
             >
               Sign Out
             </button>
          </div>
        </aside>

        {/* Dynamic Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '48px' }}>
          {children}
        </main>
      </div>

    </div>
  )
}
