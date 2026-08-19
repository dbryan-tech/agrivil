'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'

export default function MobileWeightConfirmationScreen() {
  const router = useRouter()

  return (
    <div className="min-h-dvh bg-[#FAF7F0] p-4 text-[#2B1F17] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 pb-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-[#2B1F17]">Confirm Final Weight</h1>
            <p className="text-[10px] text-[#6E6A63]">
              We have updated the exact weight of your item.
            </p>
          </div>
        </div>

        {/* Weight Confirmation Breakdown Card */}
        <div className="mt-4 rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#FAF7F0]">
              <Image
                src="/golden-acres/produce/white-yam.png"
                alt="Yam (White)"
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <h2 className="text-xs font-extrabold text-[#2B1F17]">Yam (White)</h2>
              <span className="text-[10px] text-[#0F7A43] font-bold">Weighed at pack station</span>
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-[#E0DACB]/60 pt-3 text-xs divide-y divide-[#E0DACB]/40">
            <div className="flex justify-between pt-1">
              <span className="text-[#6E6A63]">Ordered Weight</span>
              <span className="font-bold text-[#2B1F17]">2.0 kg</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-[#6E6A63]">Final Weight</span>
              <span className="font-extrabold text-[#0F7A43]">2.15 kg</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-[#6E6A63]">Price per kg</span>
              <span className="font-bold text-[#2B1F17]">{formatGHS(10.0)}</span>
            </div>
            <div className="flex justify-between pt-2.5 text-sm font-extrabold text-[#2B1F17]">
              <span>Final Price</span>
              <span className="text-[#0F7A43]">{formatGHS(21.5)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="space-y-3 pt-6">
        <button
          type="button"
          onClick={() => router.push('/m/checkout')}
          className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
        >
          Confirm
        </button>

        <button
          type="button"
          onClick={() => router.push('/m/account')}
          className="w-full text-center text-xs font-bold text-[#6E6A63] hover:text-[#0F7A43]"
        >
          Contact Support
        </button>
      </div>
    </div>
  )
}
