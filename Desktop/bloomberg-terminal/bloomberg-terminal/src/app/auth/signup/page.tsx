'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/authClient'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await signUp(email, password, name)
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
        <div className="terminal-card p-8 max-w-sm w-full text-center space-y-4">
          <CheckCircle size={40} className="text-accent-green mx-auto" />
          <h2 className="text-lg font-semibold text-text-primary">Account Created!</h2>
          <p className="text-sm text-text-secondary">
            {email} pe confirmation email bheja gaya hai. Email verify karo phir login karo.
          </p>
          <Link href="/auth/login" className="btn-primary block text-center py-2.5">
            Login Page pe Jao
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 rounded-sm overflow-hidden border border-terminal-border mb-2">
            <Image src="/logo.png" alt="Bairagi Research Capital" fill className="object-cover" />
          </div>
          <h1 className="font-display font-bold text-xl text-text-primary tracking-wide">BAIRAGI RESEARCH</h1>
          <p className="font-mono text-xs text-accent-orange tracking-[0.2em] mt-0.5">CAPITAL</p>
          <p className="text-text-muted text-sm mt-1">Professional Market Intelligence</p>
        </div>

        <div className="terminal-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-text-primary">Create Account</h2>

          {error && (
            <div className="flex items-center gap-2 bg-accent-red/10 border border-accent-red/30 rounded-sm px-3 py-2">
              <AlertCircle size={14} className="text-accent-red shrink-0" />
              <p className="text-xs text-accent-red">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3">
            <div>
              <label className="data-label mb-1 block">Full Name</label>
              <div className="relative">
                <User size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="terminal-input w-full pl-8"
                  required
                />
              </div>
            </div>

            <div>
              <label className="data-label mb-1 block">Email</label>
              <div className="relative">
                <Mail size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="terminal-input w-full pl-8"
                  required
                />
              </div>
            </div>

            <div>
              <label className="data-label mb-1 block">Password</label>
              <div className="relative">
                <Lock size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="terminal-input w-full pl-8"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : 'Sign Up'}
            </button>
          </form>

          <div className="pt-2 border-t border-terminal-border text-center">
            <p className="text-xs text-text-muted">
              Pehle se account hai?{' '}
              <Link href="/auth/login" className="text-accent-orange hover:underline">
                Login karo
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
