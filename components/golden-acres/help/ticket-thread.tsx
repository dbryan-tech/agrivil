'use client'

import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import {
  Send,
  Paperclip,
  X,
  CheckCircle2,
  Clock,
  CircleDot,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import { getTicket, replyToTicket } from '@/app/actions/support'
import type {
  SupportTicket,
  TicketAttachment,
  TicketStatus,
} from '@/lib/golden-acres/types'

const STATUS_META: Record<
  TicketStatus,
  { label: string; icon: typeof Clock; className: string }
> = {
  open: { label: 'Open', icon: CircleDot, className: 'bg-[#f3ddd5] text-[#c0492e]' },
  pending: { label: 'Awaiting reply', icon: Clock, className: 'bg-[#f6e8c8] text-[#b8791a]' },
  resolved: { label: 'Resolved', icon: CheckCircle2, className: 'bg-[#e2efd2] text-[#4f7d2f]' },
}

function timeLabel(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TicketThread({
  reference,
  onClose,
}: {
  reference: string
  onClose?: () => void
}) {
  const { data: ticket, mutate, isLoading } = useSWR<SupportTicket | null>(
    ['ticket', reference],
    () => getTicket(reference),
    { refreshInterval: 3000, revalidateOnFocus: true },
  )

  const [reply, setReply] = useState('')
  const [pending, setPending] = useState<TicketAttachment[]>([])
  const [uploading, setUploading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to the newest message whenever the count changes.
  const msgCount = ticket?.messages.length ?? 0
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgCount])

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
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function send() {
    if (sending) return
    if (!reply.trim() && pending.length === 0) return
    setSending(true)
    setError(null)
    const res = await replyToTicket({
      reference,
      body: reply.trim(),
      attachments: pending,
    })
    if (res.ok && res.ticket) {
      setReply('')
      setPending([])
      mutate(res.ticket, { revalidate: false })
    } else {
      setError(res.error ?? 'Could not send your reply.')
    }
    setSending(false)
  }

  if (isLoading && !ticket) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-border bg-card">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="font-semibold text-foreground">Ticket not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We couldn&apos;t load this conversation. It may belong to another account.
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="ga-press mt-4 rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground"
          >
            Back
          </button>
        )}
      </div>
    )
  }

  const meta = STATUS_META[ticket.status]
  const resolved = ticket.status === 'resolved'

  return (
    <div className="flex h-[32rem] flex-col overflow-hidden rounded-2xl border border-border bg-card">
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">{ticket.reference}</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.className}`}
            >
              <meta.icon className="h-3 w-3" />
              {meta.label}
            </span>
          </div>
          <p className="truncate text-sm text-muted-foreground">{ticket.subject}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close conversation"
            className="ga-press rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-background px-4 py-4">
        {ticket.messages.map((m) => {
          const mine = m.author === 'customer'
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${mine ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    mine
                      ? 'rounded-br-sm bg-primary text-primary-foreground'
                      : 'rounded-bl-sm border border-border bg-card text-foreground'
                  }`}
                >
                  {m.body && <p className="whitespace-pre-wrap">{m.body}</p>}
                  {m.attachments && m.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.attachments.map((a, i) => (
                        <a
                          key={i}
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block overflow-hidden rounded-lg border ${
                            mine ? 'border-primary-foreground/30' : 'border-border'
                          }`}
                        >
                          {a.contentType.startsWith('image/') ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={a.url || '/placeholder.svg'}
                              alt={a.name}
                              className="h-28 w-28 object-cover"
                            />
                          ) : (
                            <span className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium">
                              <Paperclip className="h-3.5 w-3.5" />
                              {a.name}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <p
                  className={`mt-1 px-1 text-[11px] text-muted-foreground ${
                    mine ? 'text-right' : 'text-left'
                  }`}
                >
                  {m.author === 'support' ? `${m.authorName} · Support` : 'You'} ·{' '}
                  {timeLabel(m.sentAt)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Composer */}
      <div className="border-t border-border bg-card px-3 py-3">
        {error && <p className="mb-2 px-1 text-xs font-medium text-destructive">{error}</p>}
        {pending.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {pending.map((a, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
              >
                <Paperclip className="h-3 w-3" />
                <span className="max-w-[8rem] truncate">{a.name}</span>
                <button
                  onClick={() => setPending((p) => p.filter((_, j) => j !== i))}
                  aria-label={`Remove ${a.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading || resolved}
            aria-label="Attach photo"
            className="ga-press flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
          </button>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            rows={1}
            placeholder={resolved ? 'Reply to re-open this ticket…' : 'Type your message…'}
            className="ga-input max-h-28 flex-1 resize-none py-2.5"
          />
          <button
            onClick={send}
            disabled={sending || (!reply.trim() && pending.length === 0)}
            aria-label="Send message"
            className="ga-press flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-2 flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3 w-3 text-[var(--ga-leaf)]" />
          Messages are encrypted at rest. Our team replies the same day.
        </p>
      </div>
    </div>
  )
}
