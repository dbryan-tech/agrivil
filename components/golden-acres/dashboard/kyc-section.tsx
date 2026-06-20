'use client'

import { useState } from 'react'
import useSWR from 'swr'
import {
  Loader2,
  Check,
  X,
  ShieldCheck,
  Clock,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react'
import {
  getKycApplicants,
  reviewKycApplicant,
  type KycApplicant,
  type KycStatus,
} from '@/app/actions/farmer-kyc'
import { ListSkeleton } from '@/components/golden-acres/ui/skeleton'
import { EmptyState } from '@/components/golden-acres/ui/empty-state'

const FILTERS: { id: KycStatus | 'all'; label: string }[] = [
  { id: 'pending', label: 'Pending' },
  { id: 'verified', label: 'Verified' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all', label: 'All' },
]

const STATUS_STYLES: Record<KycStatus, string> = {
  pending: 'bg-[var(--ga-gold)]/15 text-[var(--ga-copper-deep)]',
  verified: 'bg-[var(--ga-leaf)]/15 text-[var(--ga-leaf)]',
  rejected: 'bg-[var(--ga-deal)]/15 text-[var(--ga-deal)]',
}

export function KycSection() {
  const { data, isLoading, mutate } = useSWR('kyc-applicants', getKycApplicants)
  const [filter, setFilter] = useState<KycStatus | 'all'>('pending')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notesById, setNotesById] = useState<Record<string, string>>({})

  const applicants = data ?? []
  const counts = {
    pending: applicants.filter((a) => a.kycStatus === 'pending').length,
    verified: applicants.filter((a) => a.kycStatus === 'verified').length,
    rejected: applicants.filter((a) => a.kycStatus === 'rejected').length,
  }
  const visible =
    filter === 'all' ? applicants : applicants.filter((a) => a.kycStatus === filter)

  async function decide(a: KycApplicant, decision: 'verified' | 'rejected') {
    setBusyId(a.id)
    await reviewKycApplicant(a.id, decision, notesById[a.id])
    await mutate()
    setBusyId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="ga-display text-2xl font-bold text-foreground">
            Seller verification
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review KYC applications from prospective farmers. Approved sellers and
            their produce go live on the storefront.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[var(--ga-gold)]/12 px-4 py-2 text-sm font-bold text-[var(--ga-copper-deep)]">
          <Clock className="h-4 w-4" />
          {counts.pending} awaiting review
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = f.id === filter
          const count =
            f.id === 'all'
              ? applicants.length
              : counts[f.id as KycStatus] ?? 0
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                active
                  ? 'bg-[var(--ga-field-deep)] text-[var(--ga-cream)]'
                  : 'bg-card text-muted-foreground ring-1 ring-border hover:text-foreground'
              }`}
            >
              {f.label}
              <span className="ml-1.5 opacity-70">{count}</span>
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <ListSkeleton rows={3} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="Nothing to review"
          description={
            filter === 'pending'
              ? 'All caught up — no applications are waiting for verification.'
              : `No ${filter} applicants.`
          }
        />
      ) : (
        <div className="space-y-4">
          {visible.map((a) => (
            <article
              key={a.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">
                      {a.farmName}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${STATUS_STYLES[a.kycStatus]}`}
                    >
                      {a.kycStatus}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {a.name}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0" /> {a.town}, {a.region}
                </span>
                {a.applicantEmail && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 shrink-0" /> {a.applicantEmail}
                  </span>
                )}
                {a.applicantPhone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 shrink-0" /> {a.applicantPhone}
                  </span>
                )}
              </div>

              {a.bio && (
                <p className="mt-3 text-pretty text-sm text-foreground">{a.bio}</p>
              )}

              {a.kycStatus === 'pending' ? (
                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  <input
                    value={notesById[a.id] ?? ''}
                    onChange={(e) =>
                      setNotesById((m) => ({ ...m, [a.id]: e.target.value }))
                    }
                    placeholder="Review note (optional)"
                    className="ga-input w-full"
                    aria-label={`Review note for ${a.farmName}`}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => decide(a, 'verified')}
                      disabled={busyId === a.id}
                      className="ga-scale-interactive inline-flex items-center gap-1.5 rounded-xl bg-[var(--ga-leaf)] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                    >
                      {busyId === a.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => decide(a, 'rejected')}
                      disabled={busyId === a.id}
                      className="ga-scale-interactive inline-flex items-center gap-1.5 rounded-xl bg-card px-4 py-2 text-sm font-bold text-[var(--ga-deal)] ring-1 ring-[var(--ga-deal)]/30 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                a.kycNotes && (
                  <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">Note:</span>{' '}
                    {a.kycNotes}
                  </p>
                )
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
