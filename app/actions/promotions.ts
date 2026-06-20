"use server"

// Golden Acres — promotions / discount-code server actions.
// -----------------------------------------------------------------------------
// One module owns the lifecycle of marketing codes: the Admin console creates,
// toggles and retires them here, and the checkout validates + applies them.
// Discounts are always recomputed server-side from the authoritative subtotal
// so a tampered client value can never inflate a discount.

import { eq, sql, desc } from "drizzle-orm"
import { db } from "@/lib/db"
import { promotions as promotionsTable } from "@/lib/db/schema"

const round2 = (n: number) => Math.round(n * 100) / 100

export interface Promotion {
  id: string
  code: string
  description: string
  kind: "percent" | "flat"
  value: number
  minSubtotal: number
  maxDiscount: number | null
  usageLimit: number | null
  usedCount: number
  active: boolean
  expiresAt: string | null
  createdAt: string
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function toPromotion(r: any): Promotion {
  return {
    id: r.id,
    code: r.code,
    description: r.description ?? "",
    kind: (r.kind as Promotion["kind"]) ?? "percent",
    value: Number(r.value ?? 0),
    minSubtotal: Number(r.minSubtotal ?? 0),
    maxDiscount: r.maxDiscount != null ? Number(r.maxDiscount) : null,
    usageLimit: r.usageLimit != null ? Number(r.usageLimit) : null,
    usedCount: Number(r.usedCount ?? 0),
    active: Boolean(r.active),
    expiresAt: r.expiresAt ?? null,
    createdAt:
      r.createdAt instanceof Date
        ? r.createdAt.toISOString()
        : String(r.createdAt ?? ""),
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** All promotions for the Admin manager, newest first. */
export async function listPromotions(): Promise<Promotion[]> {
  const rows = await db
    .select()
    .from(promotionsTable)
    .orderBy(desc(promotionsTable.createdAt))
  return rows.map(toPromotion)
}

export interface CreatePromotionInput {
  code: string
  description: string
  kind: "percent" | "flat"
  value: number
  minSubtotal?: number
  maxDiscount?: number | null
  usageLimit?: number | null
  expiresAt?: string | null
  createdBy?: string
}

export interface PromotionResult {
  ok: boolean
  error?: string
  promotion?: Promotion
}

/** Create a new discount code. Codes are normalised to UPPERCASE + unique. */
export async function createPromotion(
  input: CreatePromotionInput,
): Promise<PromotionResult> {
  const code = input.code.trim().toUpperCase().replace(/\s+/g, "")
  if (!code) return { ok: false, error: "Enter a code." }
  if (!/^[A-Z0-9]{3,20}$/.test(code))
    return { ok: false, error: "Code must be 3–20 letters or numbers." }
  if (input.value <= 0) return { ok: false, error: "Discount must be greater than zero." }
  if (input.kind === "percent" && input.value > 100)
    return { ok: false, error: "A percentage cannot exceed 100%." }

  try {
    const [existing] = await db
      .select({ id: promotionsTable.id })
      .from(promotionsTable)
      .where(eq(promotionsTable.code, code))
      .limit(1)
    if (existing) return { ok: false, error: `Code ${code} already exists.` }

    const id = `promo_${crypto.randomUUID()}`
    await db.insert(promotionsTable).values({
      id,
      code,
      description: input.description.trim(),
      kind: input.kind,
      value: round2(input.value),
      minSubtotal: round2(Math.max(0, input.minSubtotal ?? 0)),
      maxDiscount:
        input.maxDiscount != null ? round2(Math.max(0, input.maxDiscount)) : null,
      usageLimit:
        input.usageLimit != null ? Math.max(1, Math.round(input.usageLimit)) : null,
      expiresAt: input.expiresAt || null,
      createdBy: input.createdBy ?? null,
      active: true,
    })

    const [row] = await db
      .select()
      .from(promotionsTable)
      .where(eq(promotionsTable.id, id))
      .limit(1)
    return { ok: true, promotion: toPromotion(row) }
  } catch (e) {
    console.log("[v0] createPromotion failed:", e)
    return { ok: false, error: "Could not create the code." }
  }
}

/** Flip a promotion on/off without deleting it. */
export async function setPromotionActive(
  id: string,
  active: boolean,
): Promise<PromotionResult> {
  try {
    await db
      .update(promotionsTable)
      .set({ active })
      .where(eq(promotionsTable.id, id))
    return { ok: true }
  } catch (e) {
    console.log("[v0] setPromotionActive failed:", e)
    return { ok: false, error: "Could not update the code." }
  }
}

/** Permanently remove a promotion. */
export async function deletePromotion(id: string): Promise<PromotionResult> {
  try {
    await db.delete(promotionsTable).where(eq(promotionsTable.id, id))
    return { ok: true }
  } catch (e) {
    console.log("[v0] deletePromotion failed:", e)
    return { ok: false, error: "Could not delete the code." }
  }
}

export interface AppliedPromo {
  code: string
  description: string
  discount: number
}

export interface ValidatePromoResult {
  ok: boolean
  error?: string
  promo?: AppliedPromo
}

/**
 * Compute the discount a code grants for a given subtotal. Pure read — does NOT
 * increment usage (that happens once an order is actually placed). Returns the
 * cedi discount, clamped to the subtotal and any per-code ceiling.
 */
function computeDiscount(p: Promotion, subtotal: number): number {
  if (p.kind === "percent") {
    let d = round2((subtotal * p.value) / 100)
    if (p.maxDiscount != null) d = Math.min(d, p.maxDiscount)
    return Math.min(d, subtotal)
  }
  return Math.min(p.value, subtotal)
}

/** Look up + validate a code against a subtotal, returning the discount. */
export async function validatePromoCode(
  rawCode: string,
  subtotal: number,
): Promise<ValidatePromoResult> {
  const code = rawCode.trim().toUpperCase().replace(/\s+/g, "")
  if (!code) return { ok: false, error: "Enter a code." }

  const [row] = await db
    .select()
    .from(promotionsTable)
    .where(eq(promotionsTable.code, code))
    .limit(1)
  if (!row) return { ok: false, error: "That code isn't valid." }

  const p = toPromotion(row)
  if (!p.active) return { ok: false, error: "This code is no longer active." }
  if (p.expiresAt && new Date(p.expiresAt) < new Date(new Date().toDateString()))
    return { ok: false, error: "This code has expired." }
  if (p.usageLimit != null && p.usedCount >= p.usageLimit)
    return { ok: false, error: "This code has been fully redeemed." }
  if (subtotal < p.minSubtotal)
    return {
      ok: false,
      error: `Spend at least GH\u20B5${p.minSubtotal.toFixed(0)} to use ${code}.`,
    }

  const discount = computeDiscount(p, subtotal)
  if (discount <= 0) return { ok: false, error: "This code has no value on your basket." }

  return {
    ok: true,
    promo: { code: p.code, description: p.description, discount },
  }
}

/**
 * Server-authoritative resolution used by the order pipeline. Re-validates the
 * code at placement time and returns the discount (0 if invalid). Never throws
 * so a stale/invalid code simply yields no discount instead of failing the order.
 */
export async function resolvePromoDiscount(
  rawCode: string | undefined,
  subtotal: number,
): Promise<{ code: string; discount: number } | null> {
  if (!rawCode) return null
  try {
    const res = await validatePromoCode(rawCode, subtotal)
    if (!res.ok || !res.promo) return null
    return { code: res.promo.code, discount: res.promo.discount }
  } catch {
    return null
  }
}

/** Increment redemption count once an order using the code is confirmed. */
export async function recordPromoRedemption(code: string): Promise<void> {
  try {
    await db
      .update(promotionsTable)
      .set({ usedCount: sql`${promotionsTable.usedCount} + 1` })
      .where(eq(promotionsTable.code, code.trim().toUpperCase()))
  } catch (e) {
    console.log("[v0] recordPromoRedemption failed:", e)
  }
}
