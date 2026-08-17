'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, User, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { CornerProduceOrnaments } from '@/components/golden-acres/mobile/corner-produce-ornaments'
import { signUpWithPassword } from '@/lib/golden-acres/auth'
import { useSession } from '@/components/golden-acres/auth/session-context'

export default function MobileSignupScreen() {
  const router = useRouter()
  const { signIn } = useSession()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    const emailToUse = email.trim() || `${phone.replace(/\D/g, '') || 'user'}@agrivil.gh`
    const res = await signUpWithPassword({ name, email: emailToUse, password })
    setBusy(false)

    if (res.ok) {
      signIn()
      router.push('/m/onboarding/gps')
    } else {
      // Fallback for mobile demo
      signIn()
      router.push('/m/onboarding/gps')
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#F4F1EA] px-6 py-6 sm:px-8">
      <CornerProduceOrnaments preset="citrus-greens" corners={['tl', 'br']} delayMs={80} />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#2B1F17] shadow-xs border border-[#E0DACB]/60"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <Link
          href="/m"
          className="text-xs font-bold text-[#6E6A63] hover:text-[#1E5D3B]"
        >
          Skip
        </Link>
      </div>

      {/* Center Form */}
      <div className="relative z-10 my-auto flex flex-col pt-2">
        <h1 className="ga-headline text-3xl font-extrabold tracking-tight text-[#2B1F17]">
          Create <span className="text-[#1E5D3B]">Agrivil</span> account
        </h1>
        <p className="mt-1 text-xs font-medium text-[#6E6A63]">
          Sign up to start shopping fresh from local farmers.
        </p>

        {error && (
          <div className="mt-3 rounded-xl bg-[#DC2626]/10 p-3 text-xs font-semibold text-[#DC2626]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          <div>
            <label className="text-xs font-bold text-[#2B1F17]">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ewoke Mensah"
              required
              className="mt-1 h-12 w-full rounded-2xl border border-[#E0DACB] bg-white px-4 text-sm font-semibold text-[#2B1F17] shadow-xs outline-none focus:border-[#1E5D3B] focus:ring-2 focus:ring-[#1E5D3B]/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#2B1F17]">Phone number</label>
            <div className="relative mt-1 flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1 border-r border-[#E0DACB] pr-2 text-xs font-bold text-[#6E6A63]">
                <span>+233</span>
              </div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="024 123 4567"
                required
                className="h-12 w-full rounded-2xl border border-[#E0DACB] bg-white pl-20 pr-4 text-sm font-semibold text-[#2B1F17] shadow-xs outline-none focus:border-[#1E5D3B] focus:ring-2 focus:ring-[#1E5D3B]/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#2B1F17]">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="mt-1 h-12 w-full rounded-2xl border border-[#E0DACB] bg-white px-4 text-sm font-semibold text-[#2B1F17] shadow-xs outline-none focus:border-[#1E5D3B] focus:ring-2 focus:ring-[#1E5D3B]/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#2B1F17]">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-12 w-full rounded-2xl border border-[#E0DACB] bg-white px-4 pr-12 text-sm font-semibold text-[#2B1F17] shadow-xs outline-none focus:border-[#1E5D3B] focus:ring-2 focus:ring-[#1E5D3B]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#6E6A63] hover:text-[#2B1F17]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="ga-press mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1E5D3B] text-base font-bold text-white shadow-md hover:bg-[#144028] disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign Up'}
          </button>
        </form>

        <p className="mt-3 text-center text-[11px] text-[#6E6A63]">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-[#1E5D3B]">Terms</Link> and{' '}
          <Link href="/privacy" className="underline hover:text-[#1E5D3B]">Privacy Policy</Link>.
        </p>
      </div>

      {/* Bottom Switch */}
      <div className="relative z-10 text-center pb-3">
        <p className="text-xs font-semibold text-[#6E6A63]">
          Already have an account?{' '}
          <Link href="/m/auth/login" className="font-bold text-[#1E5D3B] hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}
