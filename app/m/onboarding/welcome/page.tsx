'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CornerProduceOrnaments } from '@/components/golden-acres/mobile/corner-produce-ornaments'

export default function WelcomeScreen() {
  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#F4F1EA] px-6 py-8 sm:px-8">
      {/* Corner Botanical Fruits */}
      <CornerProduceOrnaments preset="welcome" delayMs={100} />

      {/* Top Bar */}
      <div className="relative z-10 flex justify-end">
        <Link
          href="/m"
          className="text-xs font-bold text-[#6E6A63] hover:text-[#1E5D3B]"
        >
          Skip
        </Link>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center">
        <h1 className="ga-headline text-3xl font-extrabold tracking-tight text-[#2B1F17] sm:text-4xl">
          Welcome to <br />
          <span className="text-[#1E5D3B]">Agrivil</span>
        </h1>
        <p className="mt-2.5 max-w-xs text-sm font-medium leading-relaxed text-[#6E6A63]">
          Ghana&apos;s freshest harvest, delivered to your door.
        </p>

        {/* Hero Produce Basket Graphic */}
        <div className="relative mt-8 h-60 w-60 sm:h-72 sm:w-72">
          <Image
            src="/golden-acres/produce/placeholder.png"
            alt="Fresh produce basket"
            fill
            className="object-contain drop-shadow-md"
            priority
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 space-y-3 pb-4">
        <Link
          href="/m/onboarding/how-it-works"
          className="ga-press flex h-14 w-full items-center justify-center rounded-2xl bg-[#1E5D3B] text-base font-bold text-white shadow-md hover:bg-[#144028]"
        >
          Get Started
        </Link>

        <Link
          href="/m/auth/login"
          className="ga-press flex h-14 w-full items-center justify-center rounded-2xl border border-[#E0DACB] bg-white/70 text-base font-bold text-[#2B1F17] hover:bg-white"
        >
          I have an account
        </Link>
      </div>
    </div>
  )
}
