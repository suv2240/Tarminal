'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/authClient'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    toast.success('Welcome back!')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
      {/* Background grid */}
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

        {/* Card */}
        <div className="terminal-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-text-primary">Sign In</h2>

          {error && (
            <div className="flex items-center gap-2 bg-accent-red/10 border border-accent-red/30 rounded-sm px-3 py-2">
              <AlertCircle size={14} className="text-accent-red shrink-0" />
              <p className="text-xs text-accent-red">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
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
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="terminal-input w-full pl-8 pr-8"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                >
                  {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="pt-2 border-t border-terminal-border text-center">
            <p className="text-xs text-text-muted">
              Account nahi hai?{' '}
              <Link href="/auth/signup" className="text-accent-orange hover:underline">
                Sign Up karo
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-text-muted mt-4">
          Not financial advice. For informational purposes only.
        </p>
      </div>
    </div>
  )
}
