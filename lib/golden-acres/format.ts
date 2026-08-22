// Golden Acres - formatting helpers
import type { Farmer } from './types'
import { haversineKm } from './geo'
import { HUB } from './data'

export function cedis(amount: number, opts: { decimals?: boolean } = {}): string {
  const { decimals = true } = opts
  return `GH\u20B5\u00A0${amount.toLocaleString('en-GH', {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  })}`
}

export function weight(kg: number): string {
  if (kg < 1) return `${Math.round(kg * 1000)} g`
  return `${kg.toLocaleString('en-GH', { maximumFractionDigits: 2 })} kg`
}

export function priceRange(min: number, max: number): string {
  return `${cedis(min)} - ${cedis(max)}`
}

export function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GH', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function dayMonth(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GH', { day: 'numeric', month: 'short' })
}

export function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' })
}

export function pct(n: number, decimals = 1): string {
  return `${(n * 100).toFixed(decimals)}%`
}

export function daysUntil(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

const PAYMENT_LABELS: Record<string, string> = {
  'momo-mtn': 'MTN MoMo',
  'momo-vodafone': 'Telecel Cash',
  card: 'Visa / Mastercard',
}
export function paymentLabel(method: string): string {
  return PAYMENT_LABELS[method] ?? method
}

// Convenience alias used across storefront components.
export function formatGHS(amount: number): string {
  return cedis(amount)
}

// Unit-aware headline price label. Variable-weight items quote per kg;
// fixed-unit items (bunch, head, each, crate) quote their base price per unit.
export function priceLabel(p: {
  variableWeight: boolean
  pricePerKg: number
  priceMin: number
  unit: string
}): string {
  if (p.variableWeight) {
    return `${cedis(p.pricePerKg, { decimals: false })}/kg`
  }
  return `${cedis(p.priceMin, { decimals: false })}/${p.unit}`
}

// Real distance from the Tema fulfilment hub, rounded for display. Falls back
// to 12km when a caller passes an optional/loose farmer shape without location.
export function distanceFromHubKm(farmer: Farmer): number {
  return Math.round(haversineKm(HUB.location, farmer.location)) || 12
}

// Freshness badge derived from shelf life remaining (FEFO-aware).
export function freshnessLabel(expiryDate: string): {
  label: string
  color: string
} {
  const left = daysUntil(expiryDate)
  if (left <= 2) return { label: 'Use soon', color: '#c0492e' }
  if (left <= 4) return { label: 'Fresh', color: '#b8791a' }
  return { label: 'Just harvested', color: '#4f7d2f' }
}

// FEFO derivation: the harvest/pack date implied by expiry minus shelf life.
// Deterministic (no Date.now), so it is safe during SSR/prerender.
export function packedDateIso(expiryDate: string, shelfLifeDays: number): string {
  return new Date(
    new Date(expiryDate).getTime() - shelfLifeDays * 86_400_000,
  ).toISOString()
}
