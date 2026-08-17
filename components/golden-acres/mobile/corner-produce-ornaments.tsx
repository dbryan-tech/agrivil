'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export type CornerPreset =
  | 'onboarding' // Matches design#.jpg (Grapes/Apple/Pear, Bananas/Mango, Tomato/Chilli, Wheat)
  | 'citrus-greens' // Citrus/Mint, Kontomire/Greens, Tubers/Yam, Habanero Peppers
  | 'welcome' // Diagonal pair (Bananas/Mango TR + Tomato/Chilli BL)
  | 'categories' // Citrus/Mint TL + Peppers/Shallots BR
  | 'farmers' // Greens TR + Wheat Stalk BR
  | 'success' // Full celebratory harvest quads

interface CornerProduceProps {
  preset?: CornerPreset
  className?: string
  /** Delay in milliseconds before triggering the entry animation (default: 80ms) */
  delayMs?: number
  /** Whether to show all 4 corners or selected pairs */
  corners?: ('tl' | 'tr' | 'bl' | 'br')[]
}

const ASSET_MAP = {
  // Set 1 (Onboarding Core / design#.jpg)
  fruits_tl: '/golden-acres/corners/corner-fruits-top-left.png',
  fruits_tr: '/golden-acres/corners/corner-fruits-top-right.png',
  crops_bl: '/golden-acres/corners/corner-crops-bottom-left.png',
  crops_br: '/golden-acres/corners/corner-crops-bottom-right.png',

  // Set 2 (Ghanaian Staples & Greens)
  citrus_tl: '/golden-acres/corners/corner-citrus-top-left.png',
  greens_tr: '/golden-acres/corners/corner-greens-top-right.png',
  tubers_bl: '/golden-acres/corners/corner-tubers-bottom-left.png',
  peppers_br: '/golden-acres/corners/corner-peppers-bottom-right.png',
}

export function CornerProduceOrnaments({
  preset = 'onboarding',
  className,
  delayMs = 80,
  corners,
}: CornerProduceProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delayMs)
    return () => clearTimeout(timer)
  }, [delayMs])

  // Resolve which asset URL to render for each corner based on chosen preset
  const resolvedCorners = {
    tl:
      preset === 'citrus-greens' || preset === 'categories'
        ? ASSET_MAP.citrus_tl
        : ASSET_MAP.fruits_tl,
    tr:
      preset === 'citrus-greens' || preset === 'farmers'
        ? ASSET_MAP.greens_tr
        : ASSET_MAP.fruits_tr,
    bl:
      preset === 'citrus-greens'
        ? ASSET_MAP.tubers_bl
        : ASSET_MAP.crops_bl,
    br:
      preset === 'citrus-greens' || preset === 'categories'
        ? ASSET_MAP.peppers_br
        : ASSET_MAP.crops_br,
  }

  // Determine active corners for this preset
  const activeCorners =
    corners ??
    (preset === 'welcome'
      ? ['tr', 'bl']
      : preset === 'farmers'
      ? ['tr', 'br']
      : ['tl', 'tr', 'bl', 'br'])

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-0 overflow-hidden select-none',
        className
      )}
      aria-hidden="true"
    >
      {/* Top-Left Corner Asset */}
      {activeCorners.includes('tl') && (
        <div
          className={cn(
            'absolute -top-3 -left-3 w-28 sm:w-36 md:w-44 aspect-square mix-blend-multiply opacity-0 transition-opacity duration-300',
            mounted && 'animate-corner-tl opacity-100'
          )}
          style={{ animationDelay: '0.05s' }}
        >
          <div className="relative h-full w-full animate-idle-float">
            <Image
              src={resolvedCorners.tl}
              alt="Fresh harvest fruits"
              fill
              sizes="(max-width: 640px) 120px, 160px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      {/* Top-Right Corner Asset */}
      {activeCorners.includes('tr') && (
        <div
          className={cn(
            'absolute -top-3 -right-3 w-32 sm:w-40 md:w-48 aspect-square mix-blend-multiply opacity-0 transition-opacity duration-300',
            mounted && 'animate-corner-tr opacity-100'
          )}
          style={{ animationDelay: '0.12s' }}
        >
          <div className="relative h-full w-full animate-idle-float" style={{ animationDelay: '1.5s' }}>
            <Image
              src={resolvedCorners.tr}
              alt="Tropical bananas and mango"
              fill
              sizes="(max-width: 640px) 140px, 180px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      {/* Bottom-Left Corner Asset */}
      {activeCorners.includes('bl') && (
        <div
          className={cn(
            'absolute -bottom-2 -left-2 w-28 sm:w-36 md:w-40 aspect-square mix-blend-multiply opacity-0 transition-opacity duration-300',
            mounted && 'animate-corner-bl opacity-100'
          )}
          style={{ animationDelay: '0.18s' }}
        >
          <div className="relative h-full w-full animate-idle-float" style={{ animationDelay: '2.5s' }}>
            <Image
              src={resolvedCorners.bl}
              alt="Fresh tomatoes and peppers"
              fill
              sizes="(max-width: 640px) 120px, 150px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      {/* Bottom-Right Corner Asset */}
      {activeCorners.includes('br') && (
        <div
          className={cn(
            'absolute -bottom-2 -right-2 w-32 sm:w-40 md:w-48 aspect-square mix-blend-multiply opacity-0 transition-opacity duration-300',
            mounted && 'animate-corner-br opacity-100'
          )}
          style={{ animationDelay: '0.24s' }}
        >
          <div className="relative h-full w-full animate-idle-float" style={{ animationDelay: '0.8s' }}>
            <Image
              src={resolvedCorners.br}
              alt="Golden wheat and grains"
              fill
              sizes="(max-width: 640px) 140px, 180px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}
