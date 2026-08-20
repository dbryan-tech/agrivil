'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'

export default function MobileSplashScreen() {
  const router = useRouter()
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 25
      })
    }, 400)

    const timer = setTimeout(() => {
      router.push('/m/onboarding/welcome')
    }, 2200)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [router])

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#0B3B25] px-6 py-10 text-white sm:px-8">
      {/* Background Cinematic Farm View */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/golden-acres/hero-farmer.jpg"
          alt="AgriVil Fresh Farm Harvest"
          fill
          priority
          className="object-cover object-center opacity-35"
        />
        {/* Deep Forest Green brand gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B3B25]/90 via-[#0B3B25]/75 to-[#0B3B25]/98" />
        {/* Soft radial golden sun aura */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#DF8821]/15 blur-3xl" />
      </div>

      {/* Top Status Bar Spacer */}
      <div className="relative z-10 pt-4" />

      {/* Center Brand Identity */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center">
        {/* Concept 01 Emblem in elevated warm canvas squircle */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#FAF7F2] p-4 shadow-2xl ring-1 ring-white/20 backdrop-blur-md">
          <Image
            src="/agrivil-mark.svg"
            alt="AgriVil"
            width={72}
            height={72}
            className="h-full w-full object-contain"
            priority
          />
        </div>

        <h1 className="mt-7 text-4xl font-extrabold tracking-[0.22em] text-white drop-shadow-md sm:text-5xl">
          AGRIVIL
        </h1>
        <div className="mt-3 flex flex-col items-center gap-0.5">
          <p className="text-[15px] font-bold tracking-wide text-[#F0A81E] drop-shadow">
            Farm Fresh. Market Smart.
          </p>
          <p className="text-xs font-medium tracking-wider text-[#FAF7F2]/80">
            Delivered with care.
          </p>
        </div>
      </div>

      {/* Bottom Loading / Manual Navigation */}
      <div className="relative z-10 flex flex-col items-center space-y-4 pb-6">
        {/* Subtle Minimalist Circular Spinner in Harvest Sun Ochre */}
        <div className="relative flex h-10 w-10 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-[#DF8821]" />
        </div>

        <Link
          href="/m/onboarding/welcome"
          className="text-xs font-semibold text-[#FAF7F2]/75 transition-colors hover:text-white"
        >
          Tap here if not redirected automatically
        </Link>
      </div>
    </div>
  )
}
