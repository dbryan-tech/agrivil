'use client'

import { useState } from 'react'
import useSWR from 'swr'
import {
  Tag,
  Plus,
  Loader2,
  Trash2,
  Percent,
  BadgePercent,
  Check,
  Power,
} from 'lucide-react'
import {
  listPromotions,
  createPromotion,
  setPromotionActive,
  deletePromotion,
  type Promotion,
} from '@/app/actions/promotions'
import { formatGHS } from '@/lib/golden-acres/format'

export function PromotionsSection() {
  const { data, isLoading, mutate } = useSWR<Promotion[]>(
    'admin-promotions',
    () => listPromotions(),
    { refreshInterval: 15000 },
  )

  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [kind, setKind] = useState<'percent' | 'flat'>('percent')
  const [value, setValue] = useState('')
  const [minSubtotal, setMinSubtotal] = useState('')
  const [maxDiscount, setMaxDiscount] = useState('')
  const [usageLimit, setUsageLimit] = useState('')
  const [creating, setCreating] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  async function submit() {
    setFormError(null)
    setCreating(true)
    const res = await createPromotion({
      code,
      description,
      kind,
      value: Number(value) || 0,
      minSubtotal: minSubtotal ? Number(minSubtotal) : 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
    })
    setCreating(false)
    if (res.ok) {
      setCode('')
      setDescription('')
      setValue('')
      setMinSubtotal('')
      setMaxDiscount('')
      setUsageLimit('')
      mutate()
    } else {
      setFormError(res.error ?? 'Could not create the code.')
    }
  }

  async function toggle(p: Promotion) {
    setBusy(p.id)
    mutate(
      (cur) =>
        (cur ?? []).map((x) =>
          x.id === p.id ? { ...x, active: !x.active } : x,
        ),
      { revalidate: false },
    )
    await setPromotionActive(p.id, !p.active)
    setBusy(null)
    mutate()
  }

  async function remove(p: Promotion) {
    setBusy(p.id)
    mutate((cur) => (cur ?? []).filter((x) => x.id !== p.id), {
      revalidate: false,
    })
    await deletePromotion(p.id)
    setBusy(null)
    mutate()
  }

  const active = (data ?? []).filter((p) => p.active).length

  return (
    <section className="mt-6 space-y-6">
      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <MiniStat
          icon={Tag}
          label="Total codes"
          value={String(data?.length ?? 0)}
        />
        <MiniStat icon={Power} label="Active" value={String(active)} />
        <MiniStat
          icon={BadgePercent}
          label="Redemptions"
          value={String(
            (data ?? []).reduce((s, p) => s + p.usedCount, 0),
          )}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Create form */}
        <div className="h-fit rounded-2xl border border-border bg-card p-5">
          <h2 className="ga-display text-xl text-foreground">New code</h2>
          <p className="text-sm text-muted-foreground">
            Create a discount customers can redeem at checkout.
          </p>
          <div className="mt-4 space-y-3">
            <FormField label="Code">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="HARVEST20"
                className="ga-input uppercase tracking-wide"
              />
            </FormField>
            <FormField label="Description">
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="20% off the autumn harvest"
                className="ga-input"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Type">
                <div className="flex rounded-xl border border-border p-1">
                  <button
                    type="button"
                    onClick={() => setKind('percent')}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors ${
                      kind === 'percent'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    Percent
                  </button>
                  <button
                    type="button"
                    onClick={() => setKind('flat')}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors ${
                      kind === 'flat'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    Flat ₵
                  </button>
                </div>
              </FormField>
              <FormField label={kind === 'percent' ? 'Percent off' : 'Cedis off'}>
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  inputMode="decimal"
                  placeholder={kind === 'percent' ? '20' : '15'}
                  className="ga-input"
                />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Min spend (₵)">
                <input
                  value={minSubtotal}
                  onChange={(e) => setMinSubtotal(e.target.value)}
                  inputMode="decimal"
                  placeholder="0"
                  className="ga-input"
                />
              </FormField>
              {kind === 'percent' ? (
                <FormField label="Max discount (₵)">
                  <input
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    inputMode="decimal"
                    placeholder="optional"
                    className="ga-input"
                  />
                </FormField>
              ) : (
                <FormField label="Usage limit">
                  <input
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    inputMode="numeric"
                    placeholder="∞"
                    className="ga-input"
                  />
                </FormField>
              )}
            </div>
            {kind === 'percent' && (
              <FormField label="Usage limit">
                <input
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  inputMode="numeric"
                  placeholder="∞ (unlimited)"
                  className="ga-input"
                />
              </FormField>
            )}
            {formError && (
              <p className="text-xs font-semibold text-[var(--ga-deal)]">
                {formError}
              </p>
            )}
            <button
              type="button"
              onClick={submit}
              disabled={creating || !code.trim() || !value.trim()}
              className="ga-press inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Create code
            </button>
          </div>
        </div>

        {/* Codes list */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="ga-display text-xl text-foreground">All codes</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Toggle to pause a code or remove it entirely.
          </p>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : data && data.length > 0 ? (
            <ul className="space-y-2.5">
              {data.map((p) => {
                const expired =
                  p.expiresAt != null &&
                  new Date(p.expiresAt).getTime() < Date.now()
                const exhausted =
                  p.usageLimit != null && p.usedCount >= p.usageLimit
                return (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        p.active && !expired && !exhausted
                          ? 'bg-[var(--ga-leaf)]/12 text-[var(--ga-leaf)]'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {p.kind === 'percent' ? (
                        <Percent className="h-5 w-5" />
                      ) : (
                        <Tag className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold tracking-wide text-foreground">
                          {p.code}
                        </span>
                        <StatusPill
                          active={p.active}
                          expired={expired}
                          exhausted={exhausted}
                        />
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.kind === 'percent'
                          ? `${p.value}% off`
                          : `${formatGHS(p.value)} off`}
                        {p.minSubtotal > 0 &&
                          ` · min ${formatGHS(p.minSubtotal)}`}
                        {p.usageLimit != null
                          ? ` · ${p.usedCount}/${p.usageLimit} used`
                          : ` · ${p.usedCount} used`}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => toggle(p)}
                        disabled={busy === p.id}
                        aria-label={p.active ? `Pause ${p.code}` : `Activate ${p.code}`}
                        className={`ga-press inline-flex h-8 items-center gap-1 rounded-full px-3 text-xs font-bold disabled:opacity-50 ${
                          p.active
                            ? 'border border-border text-muted-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        {busy === p.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : p.active ? (
                          'Pause'
                        ) : (
                          <>
                            <Check className="h-3.5 w-3.5" /> Activate
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => remove(p)}
                        disabled={busy === p.id}
                        aria-label={`Delete ${p.code}`}
                        className="ga-press inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-[var(--ga-deal)] disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <Tag className="h-8 w-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">
                No promo codes yet. Create your first one on the left.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function StatusPill({
  active,
  expired,
  exhausted,
}: {
  active: boolean
  expired: boolean
  exhausted: boolean
}) {
  let label = 'Active'
  let cls = 'bg-[var(--ga-leaf)]/15 text-[var(--ga-leaf)]'
  if (!active) {
    label = 'Paused'
    cls = 'bg-secondary text-muted-foreground'
  } else if (expired) {
    label = 'Expired'
    cls = 'bg-[var(--ga-deal)]/15 text-[var(--ga-deal)]'
  } else if (exhausted) {
    label = 'Used up'
    cls = 'bg-[var(--ga-deal)]/15 text-[var(--ga-deal)]'
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${cls}`}>
      {label}
    </span>
  )
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Tag
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
        <Icon className="h-4.5 w-4.5 text-primary" />
      </div>
      <p className="ga-display mt-2 text-2xl text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
