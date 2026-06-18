'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { V3Hero } from '@/components/v3/v3-hero'
import { V3Problem } from '@/components/v3/v3-problem'
import { V3Solution } from '@/components/v3/v3-solution'
import { V3Research } from '@/components/v3/v3-research'
import { V3Founder } from '@/components/v3/v3-founder'
import { V3Footer } from '@/components/v3/v3-footer'

export function V3Page() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  return (
    <div className="bg-white dark:bg-neutral-950">
      <V3Hero />
      <V3Problem />
      <V3Solution />
      <V3Research />
      <V3Founder />
      <V3Footer />
    </div>
  )
}
