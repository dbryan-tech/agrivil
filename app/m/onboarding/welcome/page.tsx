'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Leaf, Truck, ShieldCheck, Heart, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SlideData {
  id: number
  titlePrefix: string
  titleHighlight: string
  subtitle: string
  image: string
  imageAlt: string
  badge?: string
}

const ONBOARDING_SLIDES: SlideData[] = [
  {
    id: 1,
    titlePrefix: 'Welcome to',
    titleHighlight: 'Agrivil',
    subtitle: "Ghana's freshest harvest, delivered to your door.",
    image: '/golden-acres/bundle-box.png',
    imageAlt: 'Fresh produce harvest basket',
    badge: '100% Farm Fresh',
  },
  {
    id: 2,
    titlePrefix: 'Welcome to',
    titleHighlight: 'Agrivil',
    subtitle: 'delivered from local farmers to your door.',
    image: '/golden-acres/bundle-box.png',
    imageAlt: 'Ghana fresh vegetable & fruit basket',
    badge: 'Morning Harvest',
  },
  {
    id: 3,
    titlePrefix: 'Direct From',
    titleHighlight: 'Local Growers',
    subtitle: 'Harvested at dawn across Ashanti, Eastern & Greater Accra.',
    image: '/golden-acres/hero-farmer.jpg',
    imageAlt: 'Local Ghanaian grower in the field',
    badge: 'Fair Trade Payout',
  },
  {
    id: 4,
    titlePrefix: 'Fast Cold-Chain',
    titleHighlight: 'Doorstep Delivery',
    subtitle: 'Temperature-controlled dispatch straight from pack hub to you.',
    image: '/golden-acres/delivery.png',
    imageAlt: 'Express farm delivery courier',
    badge: 'Same-Day Dispatch',
  },
]

export default function MobileOnboardingScreen() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Touch gesture tracking
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const minSwipeDistance = 40

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % ONBOARDING_SLIDES.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + ONBOARDING_SLIDES.length) % ONBOARDING_SLIDES.length)
  }, [])

  // Auto-play timer (advances every 3.8s unless paused by touch)
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      nextSlide()
    }, 3800)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide])

  // Touch swipe event handlers
  function handleTouchStart(e: React.TouchEvent) {
    setIsPaused(true)
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.targetTouches[0].clientX
  }

  function handleTouchEnd() {
    if (!touchStartX.current || !touchEndX.current) {
      setIsPaused(false)
      return
    }
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }

    // Resume auto-play after 3 seconds of inactivity
    setTimeout(() => setIsPaused(false), 3000)
    touchStartX.current = null
    touchEndX.current = null
  }

  const activeSlide = ONBOARDING_SLIDES[currentSlide]

  return (
    <div
      className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#F7F5F0] px-3 py-4 text-[#211A12] select-none antialiased"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        paddingTop: 'max(env(safe-area-inset-top), 12px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
      }}
    >
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* 1. Top Bar with Logo & Skip */}
      <div className="relative z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/agrivil-mark.svg"
            alt="AgriVil"
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
            priority
          />
          <span className="text-[16px] font-black tracking-[0.18em] text-[#0B3B25]">
            AGRIVIL
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('agrivil_has_onboarded', 'true')
            }
            router.push('/m')
          }}
          className="text-[12px] font-extrabold tracking-wide text-[#5C5247] transition-colors hover:text-[#211A12]"
        >
          Skip
        </button>
      </div>

      {/* 2. Slide Show Hero Content */}
      <div className="relative z-10 my-auto flex flex-col items-start text-left pt-1">
        {/* Animated Headline & Subtitle */}
        <div key={`text-${currentSlide}`} className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h1 className="text-[28px] font-black tracking-tight text-[#211A12] sm:text-3xl leading-tight">
            {activeSlide.titlePrefix} <br />
            <span className="text-[#0B3B25]">{activeSlide.titleHighlight}</span>
          </h1>
          <p className="mt-1 text-[12px] font-semibold leading-relaxed text-[#5C5247] max-w-xs sm:text-sm">
            {activeSlide.subtitle}
          </p>
        </div>

        {/* Hero Visual Area with Warm Glow */}
        <div className="relative mx-auto mt-4 flex h-60 w-full max-w-xs items-center justify-center sm:h-64">
          {/* Ambient Glow */}
          <div className="absolute inset-4 rounded-full bg-[#0B3B25]/5 blur-2xl" />

          {/* Slide Visual Transition */}
          <div
            key={`img-${currentSlide}`}
            className="relative h-full w-full flex items-center justify-center animate-in zoom-in-95 fade-in duration-300"
          >
            {activeSlide.id === 3 ? (
              <div className="relative h-52 w-52 overflow-hidden rounded-3xl border border-[rgba(33,26,18,0.10)] shadow-md">
                <Image
                  src={activeSlide.image}
                  alt={activeSlide.imageAlt}
                  fill
                  className="object-cover"
                  priority
                />
                <span className="absolute bottom-2.5 left-2.5 rounded-full bg-[#0B3B25] px-2.5 py-0.5 text-[9px] font-black text-white shadow-xs">
                  {activeSlide.badge}
                </span>
              </div>
            ) : (
              <div className="relative h-52 w-52 sm:h-56 sm:w-56 flex items-center justify-center">
                <Image
                  src={activeSlide.image}
                  alt={activeSlide.imageAlt}
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Indicators & Action Footer */}
      <div className="relative z-20 space-y-3 pt-2">
        {/* 4 Indicators Dots (Slideshow Pagination) */}
        <div className="flex items-center justify-center gap-1.5 pb-1">
          {ONBOARDING_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrentSlide(idx)
                setIsPaused(true)
                setTimeout(() => setIsPaused(false), 3000)
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                currentSlide === idx
                  ? 'w-5 bg-[#0B3B25]'
                  : 'w-1.5 bg-[rgba(33,26,18,0.15)] hover:bg-[rgba(33,26,18,0.3)]'
              )}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.setItem('agrivil_has_onboarded', 'true')
              }
              router.push('/m/onboarding/how-it-works')
            }}
            className="flex h-12 w-full items-center justify-center rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
          >
            Get Started
          </button>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.setItem('agrivil_has_onboarded', 'true')
              }
              router.push('/m/auth/login')
            }}
            className="flex h-11 w-full items-center justify-center rounded-full border border-[rgba(33,26,18,0.12)] bg-white text-[12px] font-extrabold text-[#211A12] shadow-2xs active:scale-[0.98] transition-transform"
          >
            I have an account
          </button>
        </div>
      </div>
    </div>
  )
}
