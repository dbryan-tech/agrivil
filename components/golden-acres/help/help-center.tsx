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
  open: { label: 'Open', icon: CircleDot, className: 'text-[#B45309]' },
  pending: { label: 'Awaiting reply', icon: Clock, className: 'text-[#7A3F1C]' },
  resolved: { label: 'Resolved', icon: CheckCircle2, className: 'text-[#0F7A43]' },
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
    <div className="mx-auto max-w-5xl px-5 pb-20 pt-32 sm:px-8">
      <header className="ga-rise max-w-2xl">
        <p className="text-[13px] font-semibold text-[#7A3F1C]">Help &amp; support</p>
        <h1 className="ga-display-title mt-2 text-[clamp(30px,3.6vw,48px)] text-[#211A12]">
          How can we help?
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#5C5247]">
          Browse common questions, or send our Accra-based support team a
          message — we reply the same day.
        </p>
      </header>

      {/* Tabs (only show "My tickets" for signed-in customers) */}
      {customer && (
        <div className="mt-8 flex gap-x-6 border-b border-[rgba(33,26,18,0.08)]">
          {([
            { id: 'help' as const, label: 'Get help', count: 0 },
            { id: 'tickets' as const, label: 'My tickets', count: myTickets?.length ?? 0 },
          ]).map((tb) => {
            const active = view === tb.id || (tb.id === 'tickets' && activeRef)
            return (
              <button
                key={tb.id}
                onClick={() => {
                  setView(tb.id)
                  if (tb.id === 'help') setActiveRef(null)
                }}
                aria-selected={active ? 'true' : 'false'}
                className={`-mb-px shrink-0 border-b pb-2.5 text-[13.5px] transition-colors duration-300 ${
                  active
                    ? 'border-[#211A12] font-semibold text-[#211A12]'
                    : 'border-transparent font-medium text-[#8A7E72]'
                }`}
              >
                {tb.label}
                {tb.count > 0 && (
                  <span className="ga-index ml-1.5 text-[11.5px] text-[#B45309]">{tb.count}</span>
                )}
              </button>
            )
          })}
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
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
              Common questions
            </h2>
            <Faqs />

            <div className="mt-6 rounded-[16px] border border-[rgba(33,26,18,0.08)] bg-white p-4">
              <p className="text-sm font-semibold text-foreground">
                Prefer to track an existing order?
              </p>
              <Link
                href="/account"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B3B25] underline decoration-[rgba(11,59,37,0.35)] underline-offset-4 transition-colors hover:decoration-[#0B3B25]"
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
    <ul className="mt-5 border-t border-[rgba(33,26,18,0.08)]">
      {FAQS.map((f, i) => {
        const open = openFaq === i
        return (
          <li key={i} className="border-b border-[rgba(33,26,18,0.08)]">
            <button
              onClick={() => setOpenFaq(open ? null : i)}
              aria-expanded={open}
              className="group flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span
                className={`text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-300 sm:text-[16px] ${
                  open ? 'text-[#211A12]' : 'text-[#3D332A] group-hover:text-[#211A12]'
                }`}
              >
                {f.q}
              </span>
              {/* rotating plus */}
              <span
                aria-hidden
                className={`relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
                  open ? 'rotate-45 border-[rgba(11,59,37,0.5)]' : 'border-[rgba(33,26,18,0.18)]'
                }`}
              >
                <span className="absolute h-[1.5px] w-3 rounded bg-[#211A12]" />
                <span className="absolute h-3 w-[1.5px] rounded bg-[#211A12]" />
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
              style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="pb-4 pr-10 text-[14px] leading-relaxed text-[#5C5247]">{f.a}</p>
              </div>
            </div>
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
      <div className="flex flex-col items-center border-t border-[rgba(33,26,18,0.08)] py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(33,26,18,0.12)]">
          <MessageSquare width={20} height={20} className="text-[#5C5247]" />
        </div>
        <p className="ga-display-title mt-5 text-[20px] text-[#211A12]">No conversations yet</p>
        <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-[#5C5247]">
          When you message our team, your conversations show up here.
        </p>
        <button
          onClick={onStartNew}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0B3B25] px-6 py-3 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E]"
        >
          <Send width={15} height={15} />
          Start a conversation
        </button>
      </div>
    )
  }
  return (
    <ul className="border-t border-[rgba(33,26,18,0.08)]">
      {tickets.map((t) => {
        const meta = STATUS_META[t.status]
        const last = t.messages[t.messages.length - 1]
        return (
          <li key={t.id} className="border-b border-[rgba(33,26,18,0.08)]">
            <button
              onClick={() => onOpen(t.reference)}
              className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 py-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{t.reference}</span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11.5px] font-medium ${meta.className}`}
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
      <div className="rounded-[22px] border border-[rgba(15,122,67,0.25)] bg-[#FAF9F6] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(15,122,67,0.35)] text-[#0F7A43]">
          <CheckCircle2 width={24} height={24} />
        </div>
        <h2 className="ga-display-title mt-5 text-[clamp(22px,2.6vw,30px)] text-[#211A12]">
          Message received.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your ticket reference is{' '}
          <span className="font-bold text-foreground">{submitted}</span>. Our
          support team will reply shortly
          {customer ? ' — follow the conversation under My tickets' : ''}.
        </p>
        <button
          onClick={() => setSubmitted(null)}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(33,26,18,0.15)] px-5 py-2.5 text-[13.5px] font-medium text-[#211A12] transition-colors duration-300 hover:border-[rgba(11,59,37,0.45)]"
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
      <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[#211A12]">
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
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors duration-300 ${
                on
                  ? 'border-[#211A12] bg-transparent text-[#211A12]'
                  : 'border-[rgba(33,26,18,0.12)] bg-transparent text-[#8A7E72] hover:text-[#3D332A]'
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
            className="ga-underline"
          />
        </Field>
        <Field label="Phone or email">
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="+233 24 000 0000"
            className="ga-underline"
          />
        </Field>
      </div>

      <div className="mt-3">
        <Field label="Order reference (optional)">
          <input
            value={orderRef}
            onChange={(e) => setOrderRef(e.target.value)}
            placeholder="GA-24817"
            className="ga-underline"
          />
        </Field>
      </div>

      <div className="mt-3">
        <Field label="Subject">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief summary of your issue"
            className="ga-underline"
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
            className="ga-underline resize-none"
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
        <p className="mt-3 rounded-xl border border-[rgba(185,28,28,0.25)] bg-[#B91C1C]/5 px-4 py-3 text-[13.5px] font-medium leading-relaxed text-[#B91C1C]">
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
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
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
