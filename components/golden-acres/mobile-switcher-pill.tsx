'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Smartphone, Monitor, Sparkles } from 'lucide-react'

export function MobileSwitcherPill() {
  const pathname = usePathname()
  const isMobile = pathname.startsWith('/m')

  return (
    <aside aria-label="Device view switcher" className="fixed bottom-4 right-4 z-50 hidden sm:block">
      <Link
        href={isMobile ? '/' : '/m'}
        className="ga-press flex items-center gap-2 rounded-full border border-[#1E5D3B]/30 bg-[#1E5D3B] px-4 py-2.5 text-xs font-extrabold text-white shadow-2xl backdrop-blur-md transition-transform hover:scale-105 hover:bg-[#144028]"
      >
        {isMobile ? (
          <>
            <Monitor className="h-4 w-4 text-[#A3E635]" />
            <span>Switch to Desktop View</span>
          </>
        ) : (
          <>
            <Smartphone className="h-4 w-4 text-[#A3E635]" />
            <span>Open Mobile App View (/m)</span>
            <span className="flex h-2 w-2 rounded-full bg-[#A3E635] animate-pulse" />
          </>
        )}
      </Link>
    </aside>
  )
}
