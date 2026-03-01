import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const navLinks = [
    { href: '/app', label: 'Dashboard' },
    { href: '/app/blueprint', label: 'Blueprint' },
    { href: '/app/session', label: 'New Session' },
    { href: '/app/history', label: 'History' },
    { href: '/app/settings', label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/12 p-6 flex flex-col justify-between shrink-0">
        <div>
          <Link href="/app" className="text-sm tracking-widest uppercase font-sans mb-12 block">
            DEFRAG // SYSTEM
          </Link>

          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-sans text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12">
          <div className="text-xs font-mono text-white/30 truncate mb-4 border border-white/12 p-2 bg-white/5">
            USER: {user.email}
          </div>
          <form action="/auth/signout" method="post">
            <button className="text-xs font-sans text-white/60 hover:text-white transition-colors uppercase tracking-widest w-full text-left">
              Terminate Session
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
