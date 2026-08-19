'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Check, Send, Phone, MessageSquare, Mail } from 'lucide-react'
import { farmers } from '@/lib/golden-acres/data'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export default function MobileContactFarmerScreen() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || ''
  const farmer = farmers.find((f) => f.slug === rawSlug) || farmers[0]

  const [subject, setSubject] = useState('Bulk Order Inquiry')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  // Screen 9: Message Sent Confirmation View
  if (sent) {
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
          <header className="flex items-center pb-2.5">
            <button
              type="button"
              onClick={() => router.push(`/m/farmers/${farmer.slug}`)}
              aria-label="Back"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </header>

          <div className="mt-12 flex flex-col items-center justify-center text-center px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0B3B25] text-white shadow-lg animate-bounce">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>

            <h1 className="mt-4 text-[22px] font-black text-[#211A12]">
              Message Sent!
            </h1>
            <p className="mt-1.5 text-[12px] font-semibold text-[#5C5247] max-w-xs">
              {farmer.name} has received your inquiry and will reply via your in-app notifications.
            </p>
          </div>
        </div>

        <div className="relative pt-4">
          <button
            type="button"
            onClick={() => router.push(`/m/farmers/${farmer.slug}`)}
            className="flex h-12 w-full items-center justify-center rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
          >
            Back to Farm Profile
          </button>
        </div>
      </div>
    )
  }

  // Screen 8: Contact Form View
  return (
    <div className="relative min-h-dvh bg-[#F7F5F0] pb-24 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.06)] bg-[#F7F5F0]/90 backdrop-blur-md px-3 py-2.5"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-[16px] font-black text-[#211A12]">Contact Farmer</h1>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">{farmer.farmName || farmer.name}</p>
          </div>
        </div>
      </header>

      {/* Form Body */}
      <div className="relative px-3 pt-3 space-y-2.5">
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <p className="text-[12px] font-medium text-[#5C5247]">
            Send a direct message regarding custom harvests, upcoming produce availability, or bulk orders.
          </p>

          <form onSubmit={handleSubmit} className="mt-3.5 space-y-2.5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
                Inquiry Topic
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 h-11 w-full rounded-2xl border border-[rgba(33,26,18,0.10)] bg-white px-3 text-[12.5px] font-extrabold text-[#211A12] outline-none focus:border-[#0B3B25]"
              >
                <option value="Bulk Order Inquiry">Bulk / Crate Order Inquiry</option>
                <option value="Harvest Schedule">Upcoming Harvest Schedule</option>
                <option value="Farm Visit">Farm Visit &amp; Tour Request</option>
                <option value="General Question">General Farm Question</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
                Your Message
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="mt-1 w-full rounded-2xl border border-[rgba(33,26,18,0.10)] bg-white p-3 text-[12.5px] text-[#211A12] outline-none focus:border-[#0B3B25]"
              />
            </div>

            <button
              type="submit"
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
            >
              <Send className="h-4 w-4" /> Send Message
            </button>
          </form>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
