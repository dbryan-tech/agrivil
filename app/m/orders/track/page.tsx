'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  MoreVertical,
  Truck,
  Phone,
  MessageSquare,
  Check,
  Star,
  Store,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import { PackageBoxes3D } from '@/app/preview/_lib/premium'

export default function MobileOrderLiveTrackingScreen() {
  const router = useRouter()

  return (
    <div className="relative min-h-dvh w-full bg-[#EAE6DE] text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col justify-between">
      {/* Zero Scrollbar Global Styles */}
      <style jsx global>{`
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>

      {/* ========================================================
          TOP HALF: VECTOR STREET MAP (Matching Reference Image 3)
         ======================================================== */}
      <div className="relative h-[48vh] min-h-[300px] w-full overflow-hidden bg-[#EAE6DE]">
        {/* Floating Top Navigation Header */}
        <header
          className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-3.5 pt-3"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 14px)' }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.06)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          </button>

          <h1 className="text-[16px] font-black tracking-tight text-[#211A12]">
            Track Package
          </h1>

          <button
            type="button"
            aria-label="Options"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.06)] active:scale-95 transition-transform"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </header>

        {/* Vector Street Map SVG Graphics */}
        <svg
          className="absolute inset-0 h-full w-full object-cover"
          viewBox="0 0 600 480"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base map color */}
          <rect width="600" height="480" fill="#EFEBE4" />

          {/* Water body accent on right edge */}
          <path
            d="M520 0 C500 120, 540 280, 510 480 L600 480 L600 0 Z"
            fill="#CFE6FA"
            opacity="0.8"
          />

          {/* Park green zone accent */}
          <rect x="380" y="400" width="120" height="80" rx="8" fill="#E2EED8" />
          <rect x="40" y="420" width="100" height="60" rx="8" fill="#E2EED8" />

          {/* City building block shapes */}
          <rect x="60" y="70" width="70" height="90" rx="4" fill="#E2DDD5" />
          <rect x="150" y="70" width="80" height="90" rx="4" fill="#E2DDD5" />
          <rect x="250" y="70" width="90" height="90" rx="4" fill="#E2DDD5" />
          <rect x="360" y="70" width="110" height="90" rx="4" fill="#E2DDD5" />

          <rect x="60" y="180" width="70" height="100" rx="4" fill="#E2DDD5" />
          <rect x="150" y="180" width="80" height="100" rx="4" fill="#E2DDD5" />
          <rect x="250" y="180" width="90" height="100" rx="4" fill="#E2DDD5" />
          <rect x="360" y="180" width="110" height="100" rx="4" fill="#E2DDD5" />

          <rect x="60" y="300" width="70" height="110" rx="4" fill="#E2DDD5" />
          <rect x="150" y="300" width="80" height="110" rx="4" fill="#E2DDD5" />
          <rect x="250" y="300" width="90" height="110" rx="4" fill="#E2DDD5" />
          <rect x="360" y="300" width="110" height="90" rx="4" fill="#E2DDD5" />

          {/* Road Network (White / Light grid lines) */}
          <line x1="0" y1="60" x2="600" y2="60" stroke="#FFFFFF" strokeWidth="14" />
          <line x1="0" y1="170" x2="600" y2="170" stroke="#FFFFFF" strokeWidth="14" />
          <line x1="0" y1="290" x2="600" y2="290" stroke="#FFFFFF" strokeWidth="14" />
          <line x1="0" y1="420" x2="600" y2="420" stroke="#FFFFFF" strokeWidth="14" />

          <line x1="50" y1="0" x2="50" y2="480" stroke="#FFFFFF" strokeWidth="14" />
          <line x1="140" y1="0" x2="140" y2="480" stroke="#FFFFFF" strokeWidth="14" />
          <line x1="240" y1="0" x2="240" y2="480" stroke="#FFFFFF" strokeWidth="14" />
          <line x1="350" y1="0" x2="350" y2="480" stroke="#FFFFFF" strokeWidth="14" />
          <line x1="480" y1="0" x2="480" y2="480" stroke="#FFFFFF" strokeWidth="14" />

          {/* Street Labels matching Reference Image 3 */}
          <text x="270" y="85" fill="#8A8175" fontSize="9" fontWeight="700" fontFamily="sans-serif">
            Airport Rd
          </text>
          <text x="110" y="275" fill="#8A8175" fontSize="9" fontWeight="700" fontFamily="sans-serif">
            King Field Rd
          </text>
          <text x="270" y="430" fill="#8A8175" fontSize="9" fontWeight="700" fontFamily="sans-serif">
            Olaya St
          </text>

          {/* Route Path (Glowing Orange curved road from Store to Van) */}
          <path
            d="M100 350 L190 310 C210 300, 240 310, 240 280 L240 230 C240 200, 280 180, 320 180 L370 180 C400 180, 420 160, 420 130 L420 90 C420 70, 450 60, 480 60"
            fill="none"
            stroke="#E86328"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Origin Store Pin */}
          <g transform="translate(100, 350)">
            <circle cx="0" cy="0" r="18" fill="#FFFFFF" filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.15))" />
            <path
              d="M-6 -5 L6 -5 L7 0 L-7 0 Z M-7 0 L7 0 L6 6 L-6 6 Z"
              fill="#211A12"
            />
            <rect x="-4" y="1" width="3" height="5" fill="#FFFFFF" />
            <rect x="1" y="1" width="3" height="5" fill="#FFFFFF" />
          </g>

          {/* Destination / Courier Pin with 1min Floating Badge */}
          <g transform="translate(480, 60)">
            {/* Orange Destination Dot */}
            <circle cx="0" cy="0" r="8" fill="#E86328" stroke="#FFFFFF" strokeWidth="2.5" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.2))" />

            {/* Floating 1min Tooltip Pill matching reference */}
            <g transform="translate(-18, -32)">
              <rect x="0" y="0" width="58" height="24" rx="12" fill="#FFFFFF" filter="drop-shadow(0px 2px 8px rgba(0,0,0,0.12))" />
              {/* Truck Icon */}
              <path
                d="M8 12 L14 12 L16 15 L20 15 L20 18 L7 18 L7 12 Z M9 18 A 1.5 1.5 0 0 1 6 18 M18 18 A 1.5 1.5 0 0 1 15 18"
                fill="#E86328"
              />
              <text x="24" y="16" fill="#211A12" fontSize="10" fontWeight="900" fontFamily="sans-serif">
                1min
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* ========================================================
          BOTTOM HALF: FLOATING WHITE BOTTOM SHEET
          (Matching Reference Image 3)
         ======================================================== */}
      <div className="relative -mt-6 z-20 flex flex-col justify-between rounded-t-[32px] bg-white px-5 pt-3 pb-8 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        {/* Top Pull Handle Indicator */}
        <div className="mx-auto h-1 w-10 rounded-full bg-[#E5E0D8] mb-3" />

        {/* 1. Driver Profile Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Driver Avatar */}
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#211A12] border border-white shadow-xs">
              <Image
                src="/golden-acres/farmers/kwame-mensah.jpg"
                alt="Max Scott"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#5C5247]">
                <span>Delivery</span>
                <span className="flex items-center text-[#E86328] font-black">
                  <Star className="h-3 w-3 fill-[#E86328]" /> 4.9
                </span>
              </div>
              <h2 className="text-[16px] font-black tracking-tight text-[#211A12]">
                Max Scott
              </h2>
            </div>
          </div>

          {/* Circular Action Buttons */}
          <div className="flex items-center gap-2.5">
            <a
              href="tel:0245550142"
              aria-label="Call Courier"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#211A12] text-white shadow-xs active:scale-90 transition-transform"
            >
              <Phone className="h-4 w-4" />
            </a>
            <a
              href="sms:0245550142"
              aria-label="Message Courier"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#211A12] text-white shadow-xs active:scale-90 transition-transform"
            >
              <MessageSquare className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* 2. In-Transit Status Banner Pill */}
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#FFF5ED] border border-[#FDE6D2] px-3.5 py-2.5">
          <div className="flex items-center gap-2 text-[12px] font-bold text-[#E86328]">
            <span className="h-2 w-2 rounded-full bg-[#E86328] animate-pulse" />
            <span>In transit - arriving in 1 min</span>
          </div>
          <span className="text-[12px] font-black text-[#E86328]">
            0.2 km left
          </span>
        </div>

        {/* 3. Booking Details Row */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
              Booking
            </span>
            <h3 className="text-[20px] font-black tracking-tight text-[#211A12]">
              M87952263
            </h3>
          </div>

          <span className="rounded-full bg-[#211A12] px-3.5 py-1 text-[11px] font-black text-white shadow-xs">
            Transit
          </span>
        </div>

        {/* 4. Dotted Progress Track matching reference */}
        <div className="relative mt-2 pt-4 pb-1">
          {/* Dotted Line */}
          <div className="absolute left-3 right-3 top-[23px] flex items-center">
            <div className="h-[2px] w-full border-t-2 border-dotted border-[rgba(33,26,18,0.22)]" />
          </div>

          {/* Step Circles */}
          <div className="relative flex items-center justify-between">
            {/* Step 1: Picked */}
            <div className="relative flex flex-col items-center">
              <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#E86328] text-white shadow-xs">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
            </div>

            {/* Step 2: Quality Checked */}
            <div className="relative flex flex-col items-center">
              <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#E86328] text-white shadow-xs">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
            </div>

            {/* Step 3: Truck with 1min Away floating pill */}
            <div className="relative flex flex-col items-center">
              <div className="absolute -top-4.5 whitespace-nowrap">
                <span className="text-[10px] font-black text-[#211A12]">
                  1min Away
                </span>
              </div>
              <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#E86328] text-white shadow-xs">
                <Truck className="h-3 w-3 stroke-[2.5]" />
              </div>
            </div>

            {/* Step 4: Destination */}
            <div className="relative flex flex-col items-center">
              <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[rgba(33,26,18,0.20)] bg-white text-[#5C5247]">
                <Check className="h-2.5 w-2.5 stroke-[2] text-[#8A7E72]" />
              </div>
            </div>
          </div>
        </div>

        {/* 5. Order Summary Grid & 3D Packaging Boxes */}
        <div className="mt-3 border-t border-[rgba(33,26,18,0.06)] pt-3">
          <div className="flex items-end justify-between">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 flex-1 pr-2">
              {/* From */}
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
                  From
                </span>
                <h4 className="mt-0.5 truncate text-[12px] font-black text-[#211A12]">
                  Palm Springs
                </h4>
              </div>

              {/* To */}
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
                  To
                </span>
                <h4 className="mt-0.5 truncate text-[12px] font-black text-[#211A12]">
                  Diriyah, Riyadh
                </h4>
              </div>

              {/* Order Cost */}
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
                  Order Cost
                </span>
                <h4 className="mt-0.5 truncate text-[12px] font-black text-[#211A12]">
                  $328.00
                </h4>
              </div>

              {/* Customer */}
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
                  Customer
                </span>
                <h4 className="mt-0.5 truncate text-[12px] font-black text-[#211A12]">
                  Lucas
                </h4>
              </div>
            </div>

            {/* 3D Stacked Cardboard Packaging Boxes Illustration */}
            <div className="shrink-0 -mb-1 -mr-1">
              <PackageBoxes3D size={68} />
            </div>
          </div>
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="mx-auto mt-3 h-1 w-32 rounded-full bg-[rgba(33,26,18,0.20)]" />
      </div>
    </div>
  )
}

