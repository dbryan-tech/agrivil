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
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="ga-eyebrow text-primary">Get In Touch</p>
        <h1 className="ga-display mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          We’re here to help
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          Have a question about your produce delivery, bulk restaurant orders, or
          partnering as a farmer? Our Accra team responds within 30 minutes.
        </p>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-3">
        {/* Info Cards */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="ga-display mt-4 font-bold text-foreground">
              Tema Aggregation Hub
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Golden Acres Cold-Chain Hub, Plot 14 Industrial Area, Tema, Greater Accra
            </p>
            <p className="mt-2 font-mono text-xs font-semibold text-primary">
              GhanaPostGPS: GA-183-4250
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Phone className="h-5 w-5" />
            </div>
            <h3 className="ga-display mt-4 font-bold text-foreground">
              Phone &amp; WhatsApp
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Customer Support: +233 30 294 8812
            </p>
            <p className="text-sm text-muted-foreground">
              WhatsApp Support: +233 55 123 4987
            </p>
            <p className="mt-2 text-xs font-semibold text-primary">
              Daily: 6:00 AM – 8:00 PM GMT
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="ga-display mt-4 font-bold text-foreground">
              Direct Emails
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Orders &amp; Care: hello@agrivil.gh
            </p>
            <p className="text-sm text-muted-foreground">
              Farmer Relations: growers@agrivil.gh
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm lg:col-span-2">
          {done ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="ga-display mt-6 text-2xl font-bold text-foreground">
                Message Sent Successfully
              </h3>
              <p className="mt-2 max-w-md text-pretty text-muted-foreground">
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
                className="ga-press mt-6 rounded-full bg-secondary px-6 py-2.5 text-xs font-bold text-foreground hover:bg-secondary/80"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="ga-display text-2xl font-bold text-foreground">
                Send us a message
              </h2>
              <p className="text-sm text-muted-foreground">
                Fill in the form below and we’ll get back to you right away.
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                    className="h-11 w-full rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                    className="h-11 w-full rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="you@email.com"
                    className="h-11 w-full rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Topic
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, subject: e.target.value }))
                    }
                    className="h-11 w-full rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
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
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                  className="w-full rounded-xl border border-border bg-secondary/30 p-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="ga-press inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
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
