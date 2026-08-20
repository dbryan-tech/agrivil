'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import {
  LifeBuoy,
  Send,
  CheckCircle2,
  Truck,
  CreditCard,
  Leaf,
  Package,
  User,
  HelpCircle,
  ChevronDown,
  MessageSquare,
  Paperclip,
  X,
  Loader2,
  ChevronRight,
  CircleDot,
  Clock,
} from 'lucide-react'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { TicketThread } from '@/components/golden-acres/help/ticket-thread'
import { createTicket, listMyTickets } from '@/app/actions/support'
import type {
  CustomerAccount,
  SupportTicket,
  TicketAttachment,
  TicketCategory,
  TicketStatus,
} from '@/lib/golden-acres/types'

const CATEGORIES: {
  key: TicketCategory
  label: string
  icon: typeof Truck
}[] = [
  { key: 'order', label: 'My order', icon: Package },
  { key: 'delivery', label: 'Delivery', icon: Truck },
  { key: 'payment', label: 'Payment', icon: CreditCard },
  { key: 'quality', label: 'Produce quality', icon: Leaf },
  { key: 'account', label: 'My account', icon: User },
  { key: 'other', label: 'Something else', icon: HelpCircle },
]

const FAQS: { q: string; a: string }[] = [
  {
    q: 'When will my order be delivered?',
    a: 'Orders placed before 6pm are delivered within your chosen window the next day. You can track live status from your account once a driver is assigned.',
  },
  {
    q: 'How do refunds work if produce arrives damaged?',
    a: 'Snap a photo and raise a quality ticket here. Our support team reviews it the same day and reverses a full or partial refund to your Mobile Money or card — usually within 48 hours.',
  },
  {
    q: 'Which areas do you currently deliver to?',
    a: 'We are live across Greater Accra during the pilot. Enter your GhanaPostGPS on the Shop Local page to confirm coverage, or join the waitlist if you are just outside the zone.',
  },
  {
    q: 'Can I change or skip a subscription box?',
    a: 'Yes — manage, pause, or skip any box anytime from the My Boxes tab in your account. Changes apply to the next undispatched delivery.',
  },
]

const STATUS_META: Record<
  TicketStatus,
  { label: string; icon: typeof Clock; className: string }
> = {
  open: { label: 'Open', icon: CircleDot, className: 'bg-[#f3ddd5] text-[#c0492e]' },
  pending: { label: 'Awaiting reply', icon: Clock, className: 'bg-[#f6e8c8] text-[#b8791a]' },
  resolved: { label: 'Resolved', icon: CheckCircle2, className: 'bg-[#e2efd2] text-[#4f7d2f]' },
}

export function HelpCenter() {
  const { account } = useSession()
  const customer =
    account?.role === 'customer' ? (account as CustomerAccount) : null

  const [view, setView] = useState<'help' | 'tickets'>('help')
  const [activeRef, setActiveRef] = useState<string | null>(null)

  // Live list of the signed-in customer's tickets.
  const { data: myTickets, mutate: refetchTickets } = useSWR<SupportTicket[]>(
    customer ? 'my-tickets' : null,
    () => listMyTickets(),
    { refreshInterval: 8000 },
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="ga-rise max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#F0A81E]/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#7A3F1C]">
          <LifeBuoy className="h-3.5 w-3.5" />
          Help &amp; Support
        </span>
        <h1 className="ga-headline mt-3 text-pretty text-4xl font-black text-[#211A12] sm:text-5xl">
          How can we help?
        </h1>
        <p className="mt-3 text-pretty text-sm sm:text-base leading-relaxed text-[#5C5247]">
          Browse common questions, or send our Accra-based support team a message
          and we&apos;ll get back to you the same day.
        </p>
      </header>

      {/* Tabs (only show "My tickets" for signed-in customers) */}
      {customer && (
        <div className="mt-8 inline-flex rounded-full border border-black/[0.08] bg-white p-1 shadow-xs">
          <button
            onClick={() => {
              setView('help')
              setActiveRef(null)
            }}
            className={`ga-press rounded-full px-5 py-2 text-xs font-black uppercase tracking-wider transition-all ${
              view === 'help'
                ? 'bg-[#0B3B25] text-white shadow-xs'
                : 'text-[#5C5247] hover:text-[#211A12]'
            }`}
          >
            Get help
          </button>
          <button
            onClick={() => setView('tickets')}
            className={`ga-press inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black uppercase tracking-wider transition-all ${
              view === 'tickets'
                ? 'bg-[#0B3B25] text-white shadow-xs'
                : 'text-[#5C5247] hover:text-[#211A12]'
            }`}
          >
            My tickets
            {myTickets && myTickets.length > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                  view === 'tickets'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#EDE8DF] text-[#211A12]'
                }`}
              >
                {myTickets.length}
              </span>
            )}
          </button>
        </div>
      )}

      {view === 'tickets' && customer ? (
        <div className="mt-8">
          {activeRef ? (
            <div className="mx-auto max-w-2xl">
              <button
                onClick={() => setActiveRef(null)}
                className="ga-press mb-3 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                All tickets
              </button>
              <TicketThread reference={activeRef} onClose={() => setActiveRef(null)} />
            </div>
          ) : (
            <TicketsList
              tickets={myTickets}
              onOpen={(ref) => setActiveRef(ref)}
              onStartNew={() => {
                setView('help')
              }}
            />
          )}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* FAQs */}
          <section aria-label="Frequently asked questions">
            <h2 className="ga-display text-xl font-semibold text-foreground">
              Common questions
            </h2>
            <Faqs />

            <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-4">
              <p className="text-sm font-semibold text-foreground">
                Prefer to track an existing order?
              </p>
              <Link
                href="/account"
                className="ga-press mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-primary"
              >
                Go to my account
              </Link>
            </div>
          </section>

          {/* Contact form */}
          <section aria-label="Contact support">
            <ContactForm
              customer={customer}
              onCreated={(ref) => {
                refetchTickets()
                if (customer) {
                  setActiveRef(ref)
                  setView('tickets')
                }
              }}
            />
          </section>
        </div>
      )}
    </div>
  )
}

function Faqs() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  return (
    <ul className="mt-4 space-y-3">
      {FAQS.map((f, i) => {
        const open = openFaq === i
        return (
          <li
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <button
              onClick={() => setOpenFaq(open ? null : i)}
              aria-expanded={open}
              className="ga-press flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
            >
              <span className="font-semibold text-foreground">{f.q}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </button>
            {open && (
              <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function TicketsList({
  tickets,
  onOpen,
  onStartNew,
}: {
  tickets: SupportTicket[] | undefined
  onOpen: (reference: string) => void
  onStartNew: () => void
}) {
  if (!tickets) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-border bg-card">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }
  if (tickets.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <MessageSquare className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="ga-display mt-4 text-lg font-semibold text-foreground">
          No conversations yet
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          When you message our team, your conversations show up here.
        </p>
        <button
          onClick={onStartNew}
          className="ga-press mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <Send className="h-4 w-4" />
          Start a conversation
        </button>
      </div>
    )
  }
  return (
    <ul className="space-y-3">
      {tickets.map((t) => {
        const meta = STATUS_META[t.status]
        const last = t.messages[t.messages.length - 1]
        return (
          <li key={t.id}>
            <button
              onClick={() => onOpen(t.reference)}
              className="ga-press flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{t.reference}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.className}`}
                  >
                    <meta.icon className="h-3 w-3" />
                    {meta.label}
                  </span>
                </div>
                <p className="mt-0.5 truncate font-semibold text-foreground">
                  {t.subject}
                </p>
                {last && (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    <span className="font-medium">
                      {last.author === 'support' ? 'Support' : 'You'}:
                    </span>{' '}
                    {last.body || 'Sent an attachment'}
                  </p>
                )}
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function ContactForm({
  customer,
  onCreated,
}: {
  customer: CustomerAccount | null
  onCreated: (reference: string) => void
}) {
  const [category, setCategory] = useState<TicketCategory>('order')
  const [name, setName] = useState(customer?.name ?? '')
  const [contact, setContact] = useState(
    customer?.phone ?? customer?.email ?? '',
  )
  const [orderRef, setOrderRef] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState<TicketAttachment[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const valid = useMemo(
    () => name.trim() && contact.trim() && subject.trim() && message.trim(),
    [name, contact, subject, message],
  )

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('folder', 'support')
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Upload failed')
        setPending((p) => [
          ...p,
          { url: json.url, name: file.name, contentType: file.type, size: file.size },
        ])
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not attach file.')
    } finally {
      setUploading(false)
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || submitting) return
    setSubmitting(true)
    setError(null)
    const isEmail = contact.includes('@')
    const res = await createTicket({
      customerName: name.trim(),
      customerPhone: isEmail ? undefined : contact.trim(),
      customerEmail: isEmail ? contact.trim() : undefined,
      orderRef: orderRef.trim() || undefined,
      category,
      subject: subject.trim(),
      message: message.trim(),
      attachments: pending,
    })
    setSubmitting(false)
    if (res.ok && res.ticket) {
      setSubmitted(res.ticket.reference)
      setSubject('')
      setMessage('')
      setOrderRef('')
      setPending([])
      onCreated(res.ticket.reference)
    } else {
      setError(res.error ?? 'Could not send your message. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="ga-scale-in rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <CheckCircle2 className="h-7 w-7 text-[var(--ga-leaf)]" />
        </div>
        <h2 className="ga-display mt-4 text-2xl font-semibold text-foreground">
          Message received
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your ticket reference is{' '}
          <span className="font-bold text-foreground">{submitted}</span>. Our
          support team will reply shortly
          {customer ? ' — follow the conversation under My tickets' : ''}.
        </p>
        <button
          onClick={() => setSubmitted(null)}
          className="ga-press mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-border bg-card p-5 sm:p-6"
    >
      <h2 className="ga-display text-xl font-semibold text-foreground">
        Send us a message
      </h2>

      <p className="mt-4 mb-2 text-sm font-semibold text-foreground">
        What is it about?
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {CATEGORIES.map((c) => {
          const on = category === c.key
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setCategory(c.key)}
              className={`ga-press flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                on
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-background text-muted-foreground'
              }`}
            >
              <c.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{c.label}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Your name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ama Owusu"
            className="ga-input"
          />
        </Field>
        <Field label="Phone or email">
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="+233 24 000 0000"
            className="ga-input"
          />
        </Field>
      </div>

      <div className="mt-3">
        <Field label="Order reference (optional)">
          <input
            value={orderRef}
            onChange={(e) => setOrderRef(e.target.value)}
            placeholder="GA-24817"
            className="ga-input"
          />
        </Field>
      </div>

      <div className="mt-3">
        <Field label="Subject">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief summary of your issue"
            className="ga-input"
          />
        </Field>
      </div>

      <div className="mt-3">
        <Field label="Message">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Tell us what happened…"
            className="ga-input resize-none"
          />
        </Field>
      </div>

      {/* Attachments */}
      <div className="mt-3">
        <label className="ga-press inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Paperclip className="h-4 w-4" />
          )}
          Attach a photo
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </label>
        {pending.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {pending.map((a, i) => (
              <div
                key={i}
                className="relative h-16 w-16 overflow-hidden rounded-lg border border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.url || '/placeholder.svg'}
                  alt={a.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPending((p) => p.filter((_, idx) => idx !== i))
                  }
                  aria-label={`Remove ${a.name}`}
                  className="absolute right-0.5 top-0.5 rounded-full bg-foreground/70 p-0.5 text-background"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-[#f3ddd5] px-3 py-2 text-sm font-medium text-[#c0492e]">
          {error}
        </p>
      )}

      {!customer && (
        <p className="mt-3 text-xs text-muted-foreground">
          Tip:{' '}
          <Link href="/login" className="font-semibold text-primary">
            sign in
          </Link>{' '}
          to track replies and continue the conversation in your account.
        </p>
      )}

      <button
        type="submit"
        disabled={!valid || submitting}
        className="ga-press mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-bold text-primary-foreground disabled:opacity-50"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Send message
      </button>
    </form>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}
