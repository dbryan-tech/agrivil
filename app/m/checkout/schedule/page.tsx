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
    <div className="relative min-h-dvh bg-[#F7F5F0] p-3 text-[#211A12] flex flex-col justify-between select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      <div className="relative">
        {/* Header */}
        <header className="flex items-center gap-2.5 pb-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-[16px] font-black text-[#211A12]">Choose Delivery Window</h1>
        </header>

        {/* Day Selector */}
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {days.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setSelectedDay(d.key)}
              className={cn(
                'flex flex-col items-center justify-center rounded-[20px] p-2.5 transition-all shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-95',
                selectedDay === d.key
                  ? 'bg-[#0B3B25] text-white shadow-md'
                  : 'bg-[#FDFDFB] text-[#211A12]'
              )}
            >
              <Calendar className="h-4 w-4" />
              <span className="mt-1 text-[12px] font-extrabold">{d.label}</span>
              <span className="text-[9.5px] opacity-80 font-medium">{d.sub}</span>
            </button>
          ))}
        </div>

        {/* Time Slots List */}
        <div className="mt-3.5 space-y-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Available Time Slots
          </h2>

          <div className="space-y-2">
            {slots.map((s) => {
              const isSelected = selectedSlot === s.key
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSelectedSlot(s.key)}
                  className={cn(
                    'flex w-full flex-col text-left rounded-[22px] p-3 transition-all shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.99]',
                    isSelected
                      ? 'bg-[#FDFDFB] ring-2 ring-[#0B3B25]'
                      : 'bg-[#FDFDFB]'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#0B3B25]" />
                      <span className="text-[12.5px] font-extrabold text-[#211A12]">{s.time}</span>
                    </div>

                    <span className="rounded-full bg-[#0B3B25]/10 px-2 py-0.5 text-[9px] font-black text-[#0B3B25]">
                      {s.tag}
                    </span>
                  </div>

                  <p className="mt-1 text-[10.5px] font-semibold text-[#5C5247]">{s.desc}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="relative pt-4">
        <button
          type="button"
          onClick={handleConfirm}
          className="flex h-12 w-full items-center justify-center rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          Confirm Delivery Window
        </button>
      </div>
    </div>
  )
}
