'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Crosshair, ArrowLeft, Loader2 } from 'lucide-react'
import { validateGhanaPostGPS } from '@/lib/golden-acres/api'

export default function GpsSetupScreen() {
  const router = useRouter()
  const [gpsCode, setGpsCode] = useState('GA-143-3586')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    if (!gpsCode.trim()) {
      setError('Please enter a valid GhanaPostGPS code.')
      return
    }

    setLoading(true)
    setError(null)
    const res = await validateGhanaPostGPS(gpsCode.trim())
    setLoading(false)

    if (res.valid) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ga_user_gps', gpsCode.trim())
        localStorage.setItem('ga_user_area', res.area || 'KNUST, Kumasi, Ashanti Region')
      }
      router.push(`/m/onboarding/confirm-area?code=${encodeURIComponent(gpsCode.trim())}&area=${encodeURIComponent(res.area || 'KNUST, Kumasi, Ashanti Region')}`)
    } else {
      setError('Invalid GhanaPostGPS code. Example: GA-143-3586')
    }
  }

  function handleAutoLocate() {
    setGpsCode('GA-143-3586')
    setError(null)
  }

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#F7F5F0] px-3 py-4 text-[#211A12] select-none antialiased">
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <Link
          href="/m"
          className="text-[12px] font-extrabold text-[#5C5247] transition-colors hover:text-[#7A3F1C]"
        >
          Skip
        </Link>
      </div>

      {/* Center Body Content */}
      <div className="relative z-10 my-auto flex flex-col pt-2">
        <div className="max-w-xs">
          <h1 className="text-[26px] font-black tracking-tight text-[#211A12] sm:text-3xl leading-tight">
            Add your <br />
            <span className="text-[#0B3B25]">GhanaPostGPS</span>
          </h1>
          <p className="mt-1 text-[12.5px] font-semibold leading-relaxed text-[#5C5247]">
            This helps our riders find you accurately.
          </p>
        </div>

        {/* Input Card Container */}
        <form onSubmit={handleContinue} className="mt-5 rounded-[24px] bg-[#FDFDFB] p-4 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div>
            <label className="text-[10.5px] font-black uppercase tracking-wider text-[#5C5247]">
              Enter GhanaPostGPS address
            </label>
            <div className="relative mt-1.5">
              <input
                type="text"
                value={gpsCode}
                onChange={(e) => {
                  setGpsCode(e.target.value.toUpperCase())
                  if (error) setError(null)
                }}
                placeholder="GA-143-3586"
                className="h-11 w-full rounded-2xl border border-[rgba(33,26,18,0.10)] bg-white px-3.5 pr-11 text-[14px] font-bold tracking-wider text-[#211A12] outline-none transition-all focus:border-[#0B3B25] uppercase"
              />
              <button
                type="button"
                onClick={handleAutoLocate}
                title="Detect GPS location"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-xl p-1.5 text-[#0B3B25] hover:bg-black/5"
              >
                <Crosshair className="h-4.5 w-4.5" />
              </button>
            </div>
            {error && (
              <p className="mt-1.5 text-[11px] font-semibold text-[#DC2626]">{error}</p>
            )}
          </div>

          <div className="mt-3 pt-1">
            <a
              href="https://ghanapostgps.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[11px] font-bold text-[#7A3F1C] underline underline-offset-2 hover:opacity-80"
            >
              How do I get my GhanaPostGPS?
            </a>
          </div>
        </form>
      </div>

      {/* Bottom CTA Actions */}
      <div className="relative z-10 space-y-2 pb-2">
        <button
          type="button"
          onClick={handleContinue}
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Continue'}
        </button>

        <Link
          href="/m"
          className="flex h-11 w-full items-center justify-center text-[12px] font-extrabold text-[#7A3F1C] transition-colors hover:text-[#211A12]"
        >
          I&apos;ll do this later
        </Link>
      </div>
    </div>
  )
}
