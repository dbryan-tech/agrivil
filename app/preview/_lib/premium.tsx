'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  Check,
  Truck,
  Home,
  FileText,
  Wallet,
  User,
  ArrowLeft,
  ShoppingBag,
  ShoppingCart,
  Bell,
  Search,
  Star,
  Leaf,
  Users,
  GitCompareArrows,
  Heart,
  Eye,
  ShieldCheck,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'

/**
 * AgriVil — Redesign Design Primitives & SVG Assets
 * Canonical Brand Palette:
 *  - General Background (Canvas) .............. #F7F5F0
 *  - Cards (50% Whiter Than Canvas) .......... #FAF9F6
 *  - Brand Primary Green ..................... #0B3B25
 *  - Brand Copper ............................ #7A3F1C
 *  - Text Dark Neutral / Ink ................. #211A12
 *  - Text Muted .............................. #5C5247
 *  - Surface White ........................... #FFFFFF
 */

export const BRAND = {
  canvas: '#F7F5F0',
  card: '#FAF9F6', // ~50% whiter than #F7F5F0 canvas
  cardElevated: '#FFFFFF',
  ink: '#211A12',
  body: '#3D332A',
  muted: '#5C5247',
  lightGray: '#8A7E72',
  copper: '#7A3F1C',
  green: '#0B3B25',
  charcoal: '#211A12',
  red: '#B91C1C',
  border: 'rgba(33, 26, 18, 0.09)',
} as const

export type RibbonTone = 'copper' | 'charcoal' | 'green' | 'red'

const RIBBON_BG: Record<RibbonTone, string> = {
  copper: '#7A3F1C',
  charcoal: '#211A12',
  green: '#0B3B25',
  red: '#B91C1C',
}

/**
 * Dynamic Product Image Shell
 *  - Sized +40% larger than default (~70px to 74px fluid)
 *  - No visible borders
 *  - Rounded corners (rounded-[20px]) with overflow-hidden
 *  - Dynamic fill & auto-align zoom (object-cover + scale) to beautifully frame any image size/orientation
 */
export function ProductImageShell({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  return (
    <div
      className={cn(
        'relative h-[clamp(64px,8.5vh,74px)] w-[clamp(64px,8.5vh,74px)] shrink-0 overflow-hidden rounded-[20px] bg-transparent',
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="140px"
        priority={priority}
        className="object-cover object-center scale-[1.18] transition-transform duration-300 select-none filter drop-shadow-2xs"
      />
    </div>
  )
}

/**
 * MobileProduceCardRich
 * - Height reduced by 20% (aspect-[1.32/1] header, streamlined padding & button)
 * - Card background is ~50% whiter (#FAF9F6)
 */
export function MobileProduceCardRich({
  id,
  slug,
  name,
  farmName,
  image,
  price,
  unit,
  rating = 4.9,
  reviews = 121,
  organic = false,
  freshness = 'JUST HARVESTED',
  freshnessColor = '#0B3B25',
  offerCount = 6,
  onAddToCart,
}: {
  id: string
  slug: string
  name: string
  farmName: string
  image: string
  price: number
  unit: string
  rating?: number
  reviews?: number
  organic?: boolean
  freshness?: string
  freshnessColor?: string
  offerCount?: number
  onAddToCart?: () => void
}) {
  const [added, setAdded] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAdded(true)
    onAddToCart?.()
    setTimeout(() => setAdded(false), 1400)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSaved(!saved)
  }

  return (
    <Link
      href={`/preview/product?slug=${slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#FAF9F6] shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90 active:scale-[0.985] transition-transform"
    >
      {/* 1. Image Container with Badges (Reduced height: aspect-[1.32/1]) */}
      <div className="relative aspect-[1.32/1] w-full overflow-hidden bg-white/40">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-center scale-[1.06] transition-transform duration-500 group-hover:scale-112"
          sizes="(max-width: 640px) 190px, 240px"
        />

        {/* Soft bottom gradient */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

        {/* Top-Left: Organic Badge */}
        {organic && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-[#0B3B25]/95 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs backdrop-blur-xs">
            <Leaf className="h-2.5 w-2.5 stroke-[2.5]" />
            <span>Organic</span>
          </div>
        )}

        {/* Top-Right: Compare / Wishlist Icon */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
          <button
            type="button"
            onClick={handleSave}
            aria-label="Save"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#211A12] shadow-xs backdrop-blur-xs active:scale-90 transition-transform"
          >
            <GitCompareArrows className="h-3 w-3 stroke-[2.3]" />
          </button>
        </div>

        {/* Bottom-Left: Freshness Status Pill */}
        <div className="absolute bottom-1.5 left-2 z-10 flex items-center gap-1 rounded-full bg-black/45 px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider text-white backdrop-blur-md shadow-xs">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: freshnessColor }}
          />
          <span>{freshness}</span>
        </div>

        {/* Bottom-Right: Competing Farmers Offer Count */}
        {offerCount > 1 && (
          <div className="absolute bottom-1.5 right-2 z-10 flex items-center gap-1 rounded-full bg-[#7A3F1C]/90 px-1.5 py-0.5 text-[8.5px] font-extrabold text-white backdrop-blur-md shadow-xs">
            <Users className="h-2.5 w-2.5" />
            <span>{offerCount}</span>
          </div>
        )}
      </div>

      {/* 2. Content Body (Streamlined padding & margins for -20% height) */}
      <div className="flex flex-1 flex-col justify-between p-3 pt-2">
        <div>
          {/* Farm Name */}
          <span className="block truncate text-[11px] font-semibold text-[#5C5247]">
            {farmName}
          </span>

          {/* Product Title */}
          <h3 className="mt-0.5 line-clamp-1 text-[13.5px] font-black leading-tight text-[#211A12] group-hover:text-[#0B3B25] transition-colors">
            {name}
          </h3>

          {/* Star Rating */}
          <div className="mt-0.5 flex items-center gap-1 text-[10.5px] font-bold text-[#5C5247]">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-2.5 w-2.5 fill-[#F0A81E] text-[#F0A81E]"
                />
              ))}
            </div>
            <span className="font-black text-[#211A12]">{rating}</span>
            <span>({reviews})</span>
          </div>

          {/* Price Row */}
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-[10.5px] font-semibold text-[#5C5247]">from</span>
            <span className="text-[15.5px] font-black text-[#211A12] leading-none">
              {formatGHS(price)}
            </span>
            <span className="text-[10.5px] font-semibold text-[#5C5247]">
              / {unit}
            </span>
          </div>

          {/* Compare note */}
          <p className="mt-0.5 text-[10px] font-bold text-[#7A3F1C] truncate">
            Compare {offerCount} farmer prices
          </p>
        </div>

        {/* 3. Full-Width Add To Cart Button (-20% height profile) */}
        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            'mt-2 flex h-8 w-full items-center justify-center gap-1.5 rounded-full text-[12px] font-extrabold shadow-xs transition-all active:scale-95',
            added
              ? 'bg-[#0B3B25]/15 text-[#0B3B25] ring-1 ring-[#0B3B25]/30'
              : 'bg-[#0B3B25] text-white hover:bg-[#072919]'
          )}
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5 stroke-[3]" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-3 w-3 stroke-[2.4]" />
              <span>Add to cart</span>
            </>
          )}
        </button>
      </div>
    </Link>
  )
}

/**
 * Diagonal Status Ribbon
 */
export function StatusRibbon({
  label,
  tone = 'copper',
}: {
  label: string
  tone?: RibbonTone
}) {
  const bg = RIBBON_BG[tone] || '#7A3F1C'
  return (
    <div className="pointer-events-none absolute -right-[38px] top-[22px] z-20 w-[160px] rotate-45 text-center shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
      <div
        className="py-[clamp(3px,0.6vh,6px)] text-center"
        style={{ backgroundColor: bg }}
      >
        <span className="text-[clamp(9.5px,1.25vh,11.5px)] font-black uppercase tracking-[0.14em] text-white antialiased">
          {label}
        </span>
      </div>
    </div>
  )
}

/**
 * 3D Isometric Cardboard Shipping Boxes Illustration
 */
export function PackageBoxes3D({
  className,
  size = 86,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      viewBox="0 0 110 95"
      width={size}
      height={(size * 95) / 110}
      className={cn('select-none filter drop-shadow-[0_4px_8px_rgba(33,26,18,0.12)]', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="topBoxTop" x1="28" y1="12" x2="88" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E9C289" />
          <stop offset="100%" stopColor="#DCB073" />
        </linearGradient>
        <linearGradient id="topBoxLeft" x1="26" y1="28" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C99450" />
          <stop offset="100%" stopColor="#B37C39" />
        </linearGradient>
        <linearGradient id="topBoxRight" x1="56" y1="40" x2="94" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A46E2E" />
          <stop offset="100%" stopColor="#8C581E" />
        </linearGradient>
        <linearGradient id="bottomBoxTop" x1="12" y1="44" x2="82" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DEB47B" />
          <stop offset="100%" stopColor="#CF9E5E" />
        </linearGradient>
        <linearGradient id="bottomBoxLeft" x1="8" y1="52" x2="48" y2="84" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BA8643" />
          <stop offset="100%" stopColor="#A06E2E" />
        </linearGradient>
        <linearGradient id="bottomBoxRight" x1="48" y1="64" x2="92" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#925E20" />
          <stop offset="100%" stopColor="#784814" />
        </linearGradient>
        <linearGradient id="tapeGrad" x1="44" y1="20" x2="80" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7A3F1C" />
          <stop offset="100%" stopColor="#5E2F14" />
        </linearGradient>
      </defs>

      <ellipse cx="56" cy="84" rx="42" ry="9" fill="#211A12" fillOpacity="0.18" />

      <path d="M8 52 L50 36 L94 48 L50 64 Z" fill="url(#bottomBoxTop)" stroke="#7A4B17" strokeWidth="0.5" />
      <path d="M8 52 L50 64 L50 84 L8 72 Z" fill="url(#bottomBoxLeft)" stroke="#7A4B17" strokeWidth="0.5" />
      <path d="M50 64 L94 48 L94 68 L50 84 Z" fill="url(#bottomBoxRight)" stroke="#7A4B17" strokeWidth="0.5" />
      <path d="M34 58 L48 63 L48 83 L34 78 Z" fill="#7A3F1C" fillOpacity="0.75" />

      <path d="M26 26 L66 12 L96 24 L56 38 Z" fill="url(#topBoxTop)" stroke="#7A4B17" strokeWidth="0.5" />
      <path d="M26 26 L56 38 L56 62 L26 50 Z" fill="url(#topBoxLeft)" stroke="#7A4B17" strokeWidth="0.5" />
      <path d="M56 38 L96 24 L96 48 L56 62 Z" fill="url(#topBoxRight)" stroke="#7A4B17" strokeWidth="0.5" />

      <path d="M46 19 L80 30 L76 35 L42 24 Z" fill="url(#tapeGrad)" />
      <path d="M80 30 L80 54 L76 52 L76 35 Z" fill="#5E2F14" />

      <g transform="translate(63, 38) skewY(14) scale(0.95)">
        <rect x="0" y="0" width="18" height="12" rx="1.5" fill="#FFFFFF" fillOpacity="0.95" stroke="rgba(33,26,18,0.12)" strokeWidth="0.5" />
        <line x1="2.5" y1="2" x2="2.5" y2="7" stroke="#211A12" strokeWidth="1.2" />
        <line x1="4.5" y1="2" x2="4.5" y2="7" stroke="#211A12" strokeWidth="0.7" />
        <line x1="6.5" y1="2" x2="6.5" y2="7" stroke="#211A12" strokeWidth="1.4" />
        <line x1="9" y1="2" x2="9" y2="7" stroke="#211A12" strokeWidth="0.8" />
        <line x1="11" y1="2" x2="11" y2="7" stroke="#211A12" strokeWidth="1.1" />
        <line x1="13.5" y1="2" x2="13.5" y2="7" stroke="#211A12" strokeWidth="0.9" />
        <line x1="15.5" y1="2" x2="15.5" y2="7" stroke="#211A12" strokeWidth="1.3" />
        <line x1="2.5" y1="9.5" x2="15.5" y2="9.5" stroke="#8A8175" strokeWidth="0.6" />
      </g>
    </svg>
  )
}

/**
 * Dotted Route Progress Tracker
 */
export function DottedProgressTrack({
  steps,
  away,
  truckIndex,
  tone = 'copper',
}: {
  steps: { done: boolean }[]
  away?: string
  truckIndex?: number
  tone?: 'copper' | 'green'
}) {
  const activeColor = tone === 'green' ? '#0B3B25' : '#7A3F1C'

  return (
    <div className="relative pt-[clamp(18px,2.6vh,26px)] pb-[clamp(4px,0.8vh,8px)]">
      <div className="absolute left-4 right-4 top-[clamp(28px,3.8vh,38px)] flex items-center">
        <div className="h-[2px] w-full border-t-2 border-dotted border-[rgba(33,26,18,0.18)]" />
      </div>

      <div className="relative flex items-center justify-between">
        {steps.map((s, i) => {
          const isTruck = i === truckIndex
          const isDone = s.done && !isTruck

          return (
            <div key={i} className="relative flex flex-col items-center">
              {isTruck && away && (
                <div className="absolute -top-[clamp(18px,2.4vh,24px)] whitespace-nowrap">
                  <span className="text-[clamp(10px,1.35vh,12px)] font-bold text-[#211A12]">
                    {away}
                  </span>
                </div>
              )}

              <div
                className={cn(
                  'z-10 flex h-[clamp(24px,3.2vh,28px)] w-[clamp(24px,3.2vh,28px)] items-center justify-center rounded-full transition-all',
                  (isDone || isTruck) && 'text-white shadow-xs',
                  !isDone && !isTruck && 'border-2 border-[rgba(33,26,18,0.22)] bg-[#FAF9F6] text-[#5C5247]'
                )}
                style={{
                  backgroundColor: isDone || isTruck ? activeColor : '#FAF9F6',
                }}
              >
                {isTruck ? (
                  <Truck className="h-[clamp(11px,1.5vh,14px)] w-[clamp(11px,1.5vh,14px)] stroke-[2.5]" />
                ) : isDone ? (
                  <Check className="h-[clamp(11px,1.5vh,14px)] w-[clamp(11px,1.5vh,14px)] stroke-[3]" />
                ) : (
                  <Check className="h-[clamp(9px,1.3vh,12px)] w-[clamp(9px,1.3vh,12px)] stroke-[2.2] text-[#5C5247]" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Shared Mobile Bottom Navigation
 */
export function PreviewBottomNav({
  active = 'home',
  cartCount = 2,
}: {
  active?: 'home' | 'orders' | 'wallet' | 'account'
  cartCount?: number
}) {
  const tabs = [
    { key: 'home', label: 'Home', icon: Home, href: '/preview/home' },
    { key: 'orders', label: 'Orders', icon: FileText, href: '/preview/orders' },
    { key: 'wallet', label: 'Wallet', icon: Wallet, href: '/preview/wallet' },
    { key: 'account', label: 'Account', icon: User, href: '/preview/account' },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-[rgba(33,26,18,0.08)] bg-[#FAF9F6]/95 px-5 pt-2.5 pb-[clamp(18px,2.8vh,24px)] backdrop-blur-md shadow-[0_-4px_20px_rgba(33,26,18,0.04)]">
      {tabs.map((tab) => {
        const isActive = tab.key === active
        const Icon = tab.icon

        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 transition-transform active:scale-95 cursor-pointer',
              isActive
                ? 'text-[#211A12]'
                : 'text-[#211A12]/60 hover:text-[#211A12]'
            )}
          >
            <div className="relative">
              <Icon
                className={cn(
                  'h-[clamp(19px,2.5vh,22px)] w-[clamp(19px,2.5vh,22px)]',
                  isActive ? 'stroke-[2.7]' : 'stroke-[2.3]'
                )}
              />
            </div>
            <span
              className={cn(
                'text-[clamp(10px,1.3vh,12px)] tracking-tight',
                isActive ? 'font-black' : 'font-bold'
              )}
            >
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
