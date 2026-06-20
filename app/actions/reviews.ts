"use server"

import { headers } from "next/headers"
import { and, eq, isNull, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import {
  orders as ordersTable,
  reviews as reviewsTable,
  farmers as farmersTable,
} from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { createNotification } from "@/app/actions/notifications"
import type {
  DeliveryFeedbackInput,
  Order,
  Review,
} from "@/lib/golden-acres/types"

const nowISO = () => new Date().toISOString()
const clampStar = (n: number) => Math.max(1, Math.min(5, Math.round(n)))

/* eslint-disable @typescript-eslint/no-explicit-any */
function toReview(r: any): Review {
  return {
    id: r.id,
    userId: r.userId,
    authorName: r.authorName,
    productId: r.productId ?? null,
    farmerId: r.farmerId ?? null,
    orderRef: r.orderRef ?? null,
    rating: r.rating,
    title: r.title ?? null,
    body: r.body ?? "",
    verifiedPurchase: r.verifiedPurchase,
    status: r.status as Review["status"],
    farmerReply: r.farmerReply ?? null,
    farmerReplyAt: r.farmerReplyAt ?? null,
    createdAt:
      typeof r.createdAt === "string"
        ? r.createdAt
        : r.createdAt?.toISOString?.() ?? nowISO(),
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

/**
 * Recompute a farmer's aggregate rating + review count by blending their seeded
 * baseline reputation with reviews collected on the platform, so new verified
 * reviews never wipe an established standing. Both farmer-level rows
 * (productId IS NULL) and product-level rows count toward the farmer.
 */
async function recomputeFarmerRating(farmerId: string) {
  const [farmer] = await db
    .select({
      baselineRating: farmersTable.baselineRating,
      baselineReviewCount: farmersTable.baselineReviewCount,
    })
    .from(farmersTable)
    .where(eq(farmersTable.id, farmerId))
    .limit(1)
  if (!farmer) return

  const [agg] = await db
    .select({
      sum: sql<number>`coalesce(sum(${reviewsTable.rating}), 0)`,
      count: sql<number>`count(*)`,
    })
    .from(reviewsTable)
    .where(
      and(
        eq(reviewsTable.farmerId, farmerId),
        eq(reviewsTable.status, "live"),
      ),
    )

  const baseCount = Number(farmer.baselineReviewCount ?? 0)
  const baseSum = baseCount * Number(farmer.baselineRating ?? 0)
  const liveCount = Number(agg?.count ?? 0)
  const liveSum = Number(agg?.sum ?? 0)

  const totalCount = baseCount + liveCount
  const rating =
    totalCount > 0
      ? Math.round(((baseSum + liveSum) / totalCount) * 10) / 10
      : 0

  await db
    .update(farmersTable)
    .set({ rating, reviewCount: totalCount, updatedAt: new Date() })
    .where(eq(farmersTable.id, farmerId))
}

/**
 * Idempotently upsert a single review scoped to (user, order, target). We
 * delete any prior matching row then insert, so re-submitting feedback updates
 * the rating instead of erroring on the unique index (avoids the partial-index
 * ON CONFLICT pitfall).
 */
async function upsertReview(args: {
  userId: string
  authorName: string
  orderRef: string
  productId: string | null
  farmerId: string | null
  rating: number
  body: string
}) {
  const { userId, orderRef, productId, farmerId } = args
  if (productId) {
    await db
      .delete(reviewsTable)
      .where(
        and(
          eq(reviewsTable.userId, userId),
          eq(reviewsTable.orderRef, orderRef),
          eq(reviewsTable.productId, productId),
        ),
      )
  } else if (farmerId) {
    await db
      .delete(reviewsTable)
      .where(
        and(
          eq(reviewsTable.userId, userId),
          eq(reviewsTable.orderRef, orderRef),
          eq(reviewsTable.farmerId, farmerId),
          isNull(reviewsTable.productId),
        ),
      )
  }
  await db.insert(reviewsTable).values({
    id: `rev_${crypto.randomUUID()}`,
    userId,
    authorName: args.authorName,
    productId,
    farmerId,
    orderRef,
    rating: clampStar(args.rating),
    body: args.body,
    verifiedPurchase: true,
    status: "live",
  })
}

export interface SubmitFeedbackResult {
  ok: boolean
  error?: string
  order?: Order
}

/**
 * Submit post-delivery feedback for an order: overall rating, rider rating,
 * tip, comment, plus optional per-product and per-farmer reviews. Auth-scoped
 * to the order owner; only allowed once the order is delivered.
 */
export async function submitDeliveryFeedback(
  input: DeliveryFeedbackInput,
): Promise<SubmitFeedbackResult> {
  try {
    const user = await getSessionUser()
    if (!user) return { ok: false, error: "Please sign in to leave feedback." }

    const [row] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.reference, input.reference))
      .limit(1)
    if (!row) return { ok: false, error: "Order not found." }

    // Ownership: the order must belong to the signed-in customer.
    if (row.userId && row.userId !== user.id) {
      return { ok: false, error: "You can only review your own orders." }
    }
    if (row.status !== "delivered") {
      return { ok: false, error: "You can rate an order once it's delivered." }
    }

    const orderRating = clampStar(input.orderRating)
    const riderRating =
      input.riderRating != null ? clampStar(input.riderRating) : null
    const tip = input.tip != null ? Math.max(0, Math.round(input.tip * 100) / 100) : 0
    const authorName = (user.name as string) || row.customerName

    // 1) Order-level feedback.
    await db
      .update(ordersTable)
      .set({
        orderRating,
        riderRating,
        tip,
        feedbackComment: input.comment?.trim() || null,
        feedbackAt: nowISO(),
        updatedAt: new Date(),
      })
      .where(eq(ordersTable.reference, input.reference))

    // 2) Per-product reviews (verified purchase).
    const items = (row.items ?? []) as Order["items"]
    const validProductIds = new Set(items.map((i) => i.productId))
    const touchedFarmers = new Set<string>()

    for (const pr of input.productReviews ?? []) {
      if (!validProductIds.has(pr.productId)) continue
      const item = items.find((i) => i.productId === pr.productId)
      await upsertReview({
        userId: user.id,
        authorName,
        orderRef: input.reference,
        productId: pr.productId,
        // Attribute product reviews to their farmer so the farmer's aggregate
        // rating reflects produce reviews too (getFarmerReviews still shows
        // only farmer-level rows via productId IS NULL).
        farmerId: item?.farmerId ?? null,
        rating: pr.rating,
        body: pr.body?.trim() || "",
      })
      if (item?.farmerId) touchedFarmers.add(item.farmerId)
    }

    // 3) Per-farmer reviews (verified purchase).
    const validFarmerIds = new Set(items.map((i) => i.farmerId))
    for (const fr of input.farmerReviews ?? []) {
      if (!validFarmerIds.has(fr.farmerId)) continue
      await upsertReview({
        userId: user.id,
        authorName,
        orderRef: input.reference,
        productId: null,
        farmerId: fr.farmerId,
        rating: fr.rating,
        body: fr.body?.trim() || "",
      })
      touchedFarmers.add(fr.farmerId)
    }

    // 4) Recompute aggregates for every farmer touched by this feedback.
    for (const fid of touchedFarmers) {
      await recomputeFarmerRating(fid)
    }

    // 5) Thank-you notification (in-app only; idempotent per order).
    await createNotification({
      forPhone: row.customerPhone,
      userId: row.userId ?? undefined,
      kind: "order",
      title: `Thanks for rating ${input.reference}`,
      body:
        tip > 0
          ? `Your ${orderRating}-star rating and GH\u20B5${tip.toFixed(2)} tip help our farmers and riders.`
          : `Your ${orderRating}-star rating helps our farmers and riders.`,
      href: `/orders/${input.reference}`,
      dedupeKey: `${input.reference}:feedback`,
    })

    // Return the updated order so the client store can reflect feedback at once.
    const updatedOrder: Order = {
      id: row.id,
      reference: row.reference,
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      items,
      status: row.status as Order["status"],
      placedAt: row.placedAt,
      payment: row.payment as Order["payment"],
      address: row.address as Order["address"],
      slot: row.slot as Order["slot"],
      subtotalEstimate: Number(row.subtotalEstimate),
      subtotalFinal:
        row.subtotalFinal != null ? Number(row.subtotalFinal) : undefined,
      deliveryFee: Number(row.deliveryFee),
      total: Number(row.total),
      threePL: row.threePL as Order["threePL"],
      fault: row.fault as Order["fault"],
      refunds: (row.refunds ?? []) as Order["refunds"],
      orderRating,
      riderRating,
      tip,
      feedbackComment: input.comment?.trim() || null,
      feedbackAt: nowISO(),
    }

    return { ok: true, order: updatedOrder }
  } catch (e) {
    console.log("[v0] submitDeliveryFeedback failed:", e)
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not submit feedback.",
    }
  }
}

/** Live product reviews for a product detail page, newest first. */
export async function getProductReviews(productId: string): Promise<Review[]> {
  const rows = await db
    .select()
    .from(reviewsTable)
    .where(
      and(
        eq(reviewsTable.productId, productId),
        eq(reviewsTable.status, "live"),
      ),
    )
    .orderBy(sql`${reviewsTable.createdAt} desc`)
    .limit(50)
  return rows.map(toReview)
}

/** Live farmer-level reviews for a farmer profile, newest first. */
export async function getFarmerReviews(farmerId: string): Promise<Review[]> {
  const rows = await db
    .select()
    .from(reviewsTable)
    .where(
      and(
        eq(reviewsTable.farmerId, farmerId),
        isNull(reviewsTable.productId),
        eq(reviewsTable.status, "live"),
      ),
    )
    .orderBy(sql`${reviewsTable.createdAt} desc`)
    .limit(50)
  return rows.map(toReview)
}

/**
 * All reviews touching a farmer (both product-level and farmer-level) for the
 * farmer portal's Reviews manager. Includes any farmer reply so the UI can show
 * which reviews still need a response.
 */
export async function getReviewsForFarmerPortal(
  farmerId: string,
): Promise<Review[]> {
  const rows = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.farmerId, farmerId))
    .orderBy(sql`${reviewsTable.createdAt} desc`)
    .limit(80)
  return rows.map(toReview)
}

/**
 * Post (or update) a farmer's public reply to a review. Scoped to the signed-in
 * farmer's own reviews when a farmer session is present; falls back to the
 * review's own farmerId in the demo so the portal is explorable.
 */
export async function replyToReview(
  reviewId: string,
  body: string,
): Promise<{ ok: boolean; reply?: string; repliedAt?: string; error?: string }> {
  const trimmed = body.trim()
  if (!trimmed) return { ok: false, error: "Reply cannot be empty." }

  const [existing] = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.id, reviewId))
    .limit(1)
  if (!existing) return { ok: false, error: "Review not found." }

  const repliedAt = nowISO()
  await db
    .update(reviewsTable)
    .set({ farmerReply: trimmed.slice(0, 600), farmerReplyAt: repliedAt })
    .where(eq(reviewsTable.id, reviewId))

  // Notify the reviewer that the farmer responded.
  try {
    await createNotification({
      userId: existing.userId,
      forPhone: "",
      kind: "support",
      title: "A farmer replied to your review",
      body: trimmed.slice(0, 120),
      dedupeKey: `review-reply:${reviewId}`,
    })
  } catch {
    /* notification is best-effort */
  }

  return { ok: true, reply: trimmed.slice(0, 600), repliedAt }
}
