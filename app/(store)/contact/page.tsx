'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
  Headphones,
  Truck,
  Store,
} from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  })
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    // Simulate high-speed submission
    await new Promise((resolve) => setTimeout(resolve, 800))
    setBusy(false)
    setDone(true)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="ga-kicker font-extrabold text-[#7A3F1C]">Get In Touch</p>
        <h1 className="ga-headline mt-2 text-3xl font-black tracking-tight text-[#211A12] sm:text-5xl">
          We’re here to help
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-[#5C5247] text-sm sm:text-base">
          Have a question about your produce delivery, bulk restaurant orders, or
          partnering as a farmer? Our Accra team responds within 30 minutes.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {/* Info Cards */}
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-[24px] border border-black/[0.04] bg-white p-6 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="ga-headline mt-4 text-base font-black text-[#211A12]">
              Tema Aggregation Hub
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#5C5247]">
              Golden Acres Cold-Chain Hub, Plot 14 Industrial Area, Tema, Greater Accra
            </p>
            <p className="mt-2 font-mono text-xs font-bold text-[#0B3B25]">
              GhanaPostGPS: GA-183-4250
            </p>
          </div>

          <div className="rounded-[24px] border border-black/[0.04] bg-white p-6 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
              <Phone className="h-5 w-5" />
            </div>
            <h3 className="ga-headline mt-4 text-base font-black text-[#211A12]">
              Phone &amp; WhatsApp
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#5C5247]">
              Customer Support: +233 30 294 8812
            </p>
            <p className="text-xs sm:text-sm text-[#5C5247]">
              WhatsApp Support: +233 55 123 4987
            </p>
            <p className="mt-2 text-xs font-bold text-[#0B3B25]">
              Daily: 6:00 AM – 8:00 PM GMT
            </p>
          </div>

          <div className="rounded-[24px] border border-black/[0.04] bg-white p-6 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="ga-headline mt-4 text-base font-black text-[#211A12]">
              Direct Emails
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#5C5247]">
              Orders &amp; Care: hello@agrivil.gh
            </p>
            <p className="text-xs sm:text-sm text-[#5C5247]">
              Farmer Relations: growers@agrivil.gh
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-[28px] border border-black/[0.04] bg-white p-6 sm:p-8 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] lg:col-span-2">
          {done ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0B3B25]/10 text-[#0B3B25]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="ga-headline mt-6 text-2xl font-black text-[#211A12]">
                Message Sent Successfully
              </h3>
              <p className="mt-2 max-w-md text-pretty text-sm text-[#5C5247]">
                Thank you for reaching out. A customer experience agent in Accra
                will get back to you shortly via phone or email.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDone(false)
                  setForm({
                    name: '',
                    email: '',
                    phone: '',
                    subject: 'General Inquiry',
                    message: '',
                  })
                }}
                className="ga-press mt-6 rounded-full bg-[#EDE8DF] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-[#211A12] hover:bg-[#EDE8DF]/80"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="ga-headline text-2xl font-black text-[#211A12]">
                Send us a message
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5247]">
                Fill in the form below and we’ll get back to you right away.
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#5C5247]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="e.g. Kofi Mensah"
                    className="h-11 w-full rounded-xl border border-black/[0.08] bg-[#F7F5F0] px-4 text-sm font-medium text-[#211A12] outline-none transition-all focus:border-[#0B3B25] focus:bg-white focus:ring-2 focus:ring-[#0B3B25]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#5C5247]">
                    Phone Number (MoMo / WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="e.g. 055 123 4567"
                    className="h-11 w-full rounded-xl border border-black/[0.08] bg-[#F7F5F0] px-4 text-sm font-medium text-[#211A12] outline-none transition-all focus:border-[#0B3B25] focus:bg-white focus:ring-2 focus:ring-[#0B3B25]/20"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#5C5247]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="you@email.com"
                    className="h-11 w-full rounded-xl border border-black/[0.08] bg-[#F7F5F0] px-4 text-sm font-medium text-[#211A12] outline-none transition-all focus:border-[#0B3B25] focus:bg-white focus:ring-2 focus:ring-[#0B3B25]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#5C5247]">
                    Topic
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, subject: e.target.value }))
                    }
                    className="h-11 w-full rounded-xl border border-black/[0.08] bg-[#F7F5F0] px-4 text-sm font-bold text-[#211A12] outline-none transition-all focus:border-[#0B3B25] focus:bg-white focus:ring-2 focus:ring-[#0B3B25]/20"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Tracking">Order &amp; Delivery</option>
                    <option value="Quality & Returns">Quality &amp; Freshness Guarantee</option>
                    <option value="Wholesale / Restaurants">Bulk &amp; Restaurant Supply</option>
                    <option value="Farmer Partnership">Farmer Onboarding</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#5C5247]">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder="How can we help you today?"
                  className="w-full rounded-xl border border-black/[0.08] bg-[#F7F5F0] p-4 text-sm font-medium text-[#211A12] outline-none transition-all focus:border-[#0B3B25] focus:bg-white focus:ring-2 focus:ring-[#0B3B25]/20"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="ga-press inline-flex h-12 items-center gap-2 rounded-full bg-[#0B3B25] px-8 text-sm font-black text-white shadow-sm hover:bg-[#072618] disabled:opacity-50"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
