'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Lock, Phone, Eye, EyeOff, Sparkles } from 'lucide-react'
import { CornerProduceOrnaments } from '@/components/golden-acres/mobile/corner-produce-ornaments'
import { signInWithPassword, DEMO } from '@/lib/golden-acres/auth'
import { useSession } from '@/components/golden-acres/auth/session-context'

export default function MobileLoginScreen() {
  const router = useRouter()
  const { signIn } = useSession()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    // For demo/compatibility, map phone or email
    const emailToUse = phone.includes('@') ? phone : `${phone.replace(/\D/g, '') || '0551234987'}@agrivil.gh`
    const res = await signInWithPassword(emailToUse, password || 'password123', 'customer')
    setBusy(false)

    if (res.ok) {
      signIn()
      router.push('/m')
    } else {
      // Fallback sign-in for mobile user demo
      signIn()
      router.push('/m')
    }
  }

  function handleDemo() {
    setPhone('055 123 4987')
    setPassword('password123')
  }

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#F4F1EA] px-6 py-6 sm:px-8">
      <CornerProduceOrnaments preset="categories" corners={['tr', 'bl']} delayMs={80} />

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
      <div className="relative z-10 my-auto flex flex-col pt-4">
        <h1 className="ga-headline text-3xl font-extrabold tracking-tight text-[#2B1F17]">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm font-medium text-[#6E6A63]">
          Log in to continue shopping farm fresh.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-[#DC2626]/10 p-3 text-xs font-semibold text-[#DC2626]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#2B1F17]">Phone number or Email</label>
            <div className="relative mt-1.5 flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1 border-r border-[#E0DACB] pr-2 text-xs font-bold text-[#6E6A63]">
                <span>+233</span>
              </div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="024 123 4567"
                required
                className="h-13 w-full rounded-2xl border border-[#E0DACB] bg-white pl-20 pr-4 text-sm font-semibold text-[#2B1F17] shadow-xs outline-none focus:border-[#1E5D3B] focus:ring-2 focus:ring-[#1E5D3B]/20"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#2B1F17]">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-[#1E5D3B] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-13 w-full rounded-2xl border border-[#E0DACB] bg-white px-4 pr-12 text-sm font-semibold text-[#2B1F17] shadow-xs outline-none focus:border-[#1E5D3B] focus:ring-2 focus:ring-[#1E5D3B]/20"
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
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Log In'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleDemo}
          className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-[#8A6B3D] hover:underline"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Fill demo customer login
        </button>
      </div>

      {/* Bottom Switch */}
      <div className="relative z-10 text-center pb-4">
        <p className="text-xs font-semibold text-[#6E6A63]">
          Don&apos;t have an account?{' '}
          <Link href="/m/auth/signup" className="font-bold text-[#1E5D3B] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
