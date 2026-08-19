'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, Calendar, Truck, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MobileDeliveryScheduleScreen() {
  const router = useRouter()
  const [selectedDay, setSelectedDay] = useState('today')
  const [selectedSlot, setSelectedSlot] = useState('dawn')

  const days = [
    { key: 'today', label: 'Today', sub: 'Dawn Harvest' },
    { key: 'tomorrow', label: 'Tomorrow', sub: 'Next Morning' },
    { key: 'saturday', label: 'Saturday', sub: 'Weekend Box' },
  ]

  const slots = [
    {
      key: 'dawn',
      time: '6:00 AM – 9:00 AM',
      tag: 'Dawn Fresh (Recommended)',
      desc: 'Dispatched immediately after packing at Ejisu hub.',
    },
    {
      key: 'midday',
      time: '11:00 AM – 2:00 PM',
      tag: 'Standard Slot',
      desc: 'Cold-chain insulated courier delivery.',
    },
    {
      key: 'evening',
      time: '4:00 PM – 7:00 PM',
      tag: 'Evening Delivery',
      desc: 'Direct home delivery before dinner.',
    },
  ]

  function handleConfirm() {
    router.push('/m/checkout')
  }

  return (
    <div className="min-h-dvh bg-[#FAF7F0] p-4 text-[#2B1F17] flex flex-col justify-between">
      <div>
        {/* Header */}
        <header className="flex items-center gap-2.5 pb-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-base font-extrabold text-[#2B1F17]">Choose Delivery Window</h1>
        </header>

        {/* Day Selector */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {days.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setSelectedDay(d.key)}
              className={cn(
                'ga-press flex flex-col items-center justify-center rounded-2xl p-3 border transition-all',
                selectedDay === d.key
                  ? 'border-[#0F7A43] bg-[#0F7A43] text-white shadow-xs'
                  : 'border border-[#E0DACB] bg-white text-[#2B1F17]'
              )}
            >
              <Calendar className="h-4 w-4" />
              <span className="mt-1 text-xs font-extrabold">{d.label}</span>
              <span className="text-[9px] opacity-80">{d.sub}</span>
            </button>
          ))}
        </div>

        {/* Time Slots List */}
        <div className="mt-4 space-y-2.5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
            Available Time Slots
          </h2>

          <div className="space-y-2.5">
            {slots.map((s) => {
              const isSelected = selectedSlot === s.key
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSelectedSlot(s.key)}
                  className={cn(
                    'ga-press flex w-full flex-col text-left rounded-3xl border p-3.5 transition-all',
                    isSelected
                      ? 'border-[#0F7A43] bg-white shadow-xs ring-2 ring-[#0F7A43]/20'
                      : 'border-[#E0DACB] bg-white shadow-xs'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#0F7A43]" />
                      <span className="text-xs font-extrabold text-[#2B1F17]">{s.time}</span>
                    </div>

                    <span className="rounded-full bg-[#0F7A43]/10 px-2 py-0.5 text-[9px] font-bold text-[#0F7A43]">
                      {s.tag}
                    </span>
                  </div>

                  <p className="mt-1.5 text-[10px] text-[#6E6A63]">{s.desc}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-6">
        <button
          type="button"
          onClick={handleConfirm}
          className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
        >
          Confirm Delivery Window
        </button>
      </div>
    </div>
  )
}
