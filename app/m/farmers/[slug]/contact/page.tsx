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
      <div className="min-h-dvh bg-[#FAF7F0] p-4 text-[#2B1F17] flex flex-col justify-between">
        <header className="flex items-center">
          <button
            type="button"
            onClick={() => router.push(`/m/farmers/${farmer.slug}`)}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </header>

        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0F7A43] text-white shadow-lg animate-bounce">
            <Check className="h-10 w-10 stroke-[3]" />
          </div>

          <h1 className="ga-headline mt-5 text-2xl font-extrabold text-[#2B1F17]">
            Message Sent!
          </h1>
          <p className="mt-2 text-xs text-[#6E6A63] max-w-xs">
            {farmer.name} has received your inquiry and will reply via your in-app notifications.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => router.push(`/m/farmers/${farmer.slug}`)}
            className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
          >
            Back to Farm Profile
          </button>
        </div>
      </div>
    )
  }

  // Screen 8: Contact Form View
  return (
    <div className="min-h-dvh bg-[#FAF7F0] pb-24 text-[#2B1F17]">
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E0DACB] bg-[#FAF7F0] px-3 sm:px-4 py-2.5"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-[#2B1F17]">Contact Farmer</h1>
            <p className="text-[10px] text-[#6E6A63]">{farmer.farmName || farmer.name}</p>
          </div>
        </div>
      </header>

      {/* Form Body */}
      <div className="px-3 sm:px-4 pt-3.5 space-y-3.5">
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <p className="text-xs text-[#6E6A63]">
            Send a direct message regarding custom harvests, upcoming produce availability, or bulk orders.
          </p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E6A63]">
                Inquiry Topic
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 h-11 w-full rounded-2xl border border-[#E0DACB] bg-[#FAF7F0] px-3 text-xs font-bold text-[#2B1F17] outline-none focus:border-[#0F7A43]"
              >
                <option value="Bulk Order Inquiry">Bulk / Crate Order Inquiry</option>
                <option value="Harvest Schedule">Upcoming Harvest Schedule</option>
                <option value="Farm Visit">Farm Visit &amp; Tour Request</option>
                <option value="General Question">General Farm Question</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E6A63]">
                Your Message
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="mt-1 w-full rounded-2xl border border-[#E0DACB] bg-[#FAF7F0] p-3 text-xs outline-none focus:border-[#0F7A43]"
              />
            </div>

            <button
              type="submit"
              className="ga-press mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
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
