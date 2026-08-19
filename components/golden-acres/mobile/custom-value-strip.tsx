'use client'

import { Truck, Leaf, ShieldCheck, Sparkles, Sprout, HeartHandshake } from 'lucide-react'

export function CustomValueStrip() {
  return (
    <div className="rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs">
      <div className="grid grid-cols-3 divide-x divide-[#E0DACB]/60 text-left">
        {/* 1. Reliable delivery */}
        <div className="flex flex-col items-start px-2 first:pl-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFE9DD] border border-[#D5CEBD]/80 text-[#2B1F17] shadow-2xs mb-2">
            <Truck className="h-5 w-5 stroke-[2.2] text-[#2B1F17]" />
          </div>
          <h4 className="text-[11px] font-extrabold text-[#2B1F17] leading-tight">
            Reliable delivery
          </h4>
          <p className="mt-1 text-[9px] text-[#6E6A63] leading-snug">
            Fast, safe and temperature conscious delivery.
          </p>
        </div>

        {/* 2. Support local */}
        <div className="flex flex-col items-start px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFE9DD] border border-[#D5CEBD]/80 text-[#0F7A43] shadow-2xs mb-2">
            <Sprout className="h-5 w-5 stroke-[2.2] text-[#0F7A43]" />
          </div>
          <h4 className="text-[11px] font-extrabold text-[#2B1F17] leading-tight">
            Support local
          </h4>
          <p className="mt-1 text-[9px] text-[#6E6A63] leading-snug">
            Every order helps farmers and communities grow.
          </p>
        </div>

        {/* 3. Secure & private */}
        <div className="flex flex-col items-start px-2 last:pr-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFE9DD] border border-[#D5CEBD]/80 text-[#2B1F17] shadow-2xs mb-2">
            <ShieldCheck className="h-5 w-5 stroke-[2.2] text-[#2B1F17]" />
          </div>
          <h4 className="text-[11px] font-extrabold text-[#2B1F17] leading-tight">
            Secure &amp; private
          </h4>
          <p className="mt-1 text-[9px] text-[#6E6A63] leading-snug">
            Your data is protected and never misused.
          </p>
        </div>
      </div>
    </div>
  )
}
