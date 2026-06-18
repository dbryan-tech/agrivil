import type { LoyaltyTier } from './types'

/**
 * Golden Acres loyalty model.
 *
 * Points are earned at ~1 point per GH₵ spent (awarded on order completion).
 * Points redeem for delivery/credit at checkout. Lifetime points drive tier.
 * Pure functions — no state — so any surface can derive tier + perks.
 */

export interface TierMeta {
  id: LoyaltyTier
  label: string
  /** lifetime points required to reach this tier */
  threshold: number
  /** brand color token for the tier badge */
  color: string
  /** human perks shown in the rewards hub */
  perks: string[]
  /** earn multiplier applied to base points */
  earnMultiplier: number
}

export const TIERS: TierMeta[] = [
  {
    id: 'sprout',
    label: 'Sprout',
    threshold: 0,
    color: 'var(--ga-leaf)',
    earnMultiplier: 1,
    perks: ['1 point per GH₵ spent', 'Member-only weekly deals'],
  },
  {
    id: 'harvest',
    label: 'Harvest',
    threshold: 500,
    color: 'var(--ga-field)',
    earnMultiplier: 1.25,
    perks: [
      '1.25× points on every order',
      'Free delivery on orders over GH₵150',
      'Early access to seasonal boxes',
    ],
  },
  {
    id: 'golden',
    label: 'Golden',
    threshold: 1500,
    color: 'var(--ga-gold)',
    earnMultiplier: 1.5,
    perks: [
      '1.5× points on every order',
      'Free delivery on all orders',
      'Priority support & priority delivery slots',
      'Surprise harvest gifts',
    ],
  },
]

/** GH₵ value of a single point when redeemed at checkout. */
export const POINT_VALUE_GHS = 0.05 // 100 pts = GH₵5
/** Minimum points before redemption is allowed. */
export const MIN_REDEEM_POINTS = 100

export function tierFor(points: number): TierMeta {
  let current = TIERS[0]
  for (const t of TIERS) {
    if (points >= t.threshold) current = t
  }
  return current
}

export function nextTier(points: number): TierMeta | null {
  return TIERS.find((t) => t.threshold > points) ?? null
}

/** 0..1 progress toward the next tier (1 if already at the top). */
export function tierProgress(points: number): number {
  const current = tierFor(points)
  const next = nextTier(points)
  if (!next) return 1
  const span = next.threshold - current.threshold
  return Math.min(1, Math.max(0, (points - current.threshold) / span))
}

/** Points earned for a given order total, respecting the tier multiplier. */
export function pointsForSpend(totalGhs: number, points: number): number {
  return Math.round(totalGhs * tierFor(points).earnMultiplier)
}

/** Cedi value of a points balance (capped to a redeemable amount). */
export function pointsToCedis(points: number): number {
  return Math.round(points * POINT_VALUE_GHS * 100) / 100
}

/** Largest whole-point redemption not exceeding the order total. */
export function maxRedeemablePoints(points: number, orderTotalGhs: number): number {
  if (points < MIN_REDEEM_POINTS) return 0
  const capByOrder = Math.floor(orderTotalGhs / POINT_VALUE_GHS)
  return Math.max(0, Math.min(points, capByOrder))
}
