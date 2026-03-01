'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Initialization Started",
        description: "Check your email to verify your coordinates.",
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col">
      <nav className="p-6 border-b border-white/12 flex items-center justify-between">
        <Link href="/" className="text-sm tracking-widest uppercase font-sans">
          DEFRAG
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md border border-white/12 p-8">
          <h1 className="text-3xl font-serif mb-2">Initialize Profile</h1>
          <p className="font-sans text-white/60 text-sm mb-8">Establish your baseline structure.</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              className="w-full bg-transparent border border-white/12 px-4 py-3 font-sans text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 disabled:opacity-50 transition-opacity"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="w-full bg-transparent border border-white/12 px-4 py-3 font-sans text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 disabled:opacity-50 transition-opacity"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-sans text-sm font-medium py-4 hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center mt-6"
            >
              {isLoading ? "Processing..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-sans text-white/60">
            Already registered? <Link href="/auth/login" className="text-white hover:underline">Access Portal</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
