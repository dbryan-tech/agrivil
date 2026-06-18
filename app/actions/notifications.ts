"use server"

// Golden Acres — notifications server actions (DB-backed).
// -----------------------------------------------------------------------------
// The single place notifications are created, read and marked read. Every
// notification is written to Neon (the in-app bell feed) and, for the channels
// that warrant it, also fanned out over SMS through the provider seam.
//
// Idempotency: callers pass a stable `dedupeKey` (e.g. "GA-123:out-for-delivery")
// so the same delivery event firing twice — webhook retry, double poll, etc. —
// never produces duplicate notifications or duplicate SMS. The unique partial
// index on notifications.dedupeKey enforces this at the database level; we use
// ON CONFLICT DO NOTHING and detect whether a row was actually inserted.

import { db } from "@/lib/db"
import { notifications as notificationsTable } from "@/lib/db/schema"
import { eq, desc, and } from "drizzle-orm"
import { sendSms, toE164Ghana } from "@/lib/golden-acres/sms"

// Canonical phone key. All notifications are keyed by E.164 so the same
// customer's number resolves identically whether it was captured as
// "024 555 0101", "+233 24 555 0101" or "233245550101". Falls back to a
// digit-stripped form if the number can't be coerced (keeps lookups stable).
function phoneKey(raw: string): string {
  return toE164Ghana(raw) ?? raw.replace(/[^\d+]/g, "")
}
import type {
  Notification,
  NotificationKind,
  NotificationChannel,
} from "@/lib/golden-acres/types"

/* eslint-disable @typescript-eslint/no-explicit-any */
function toNotification(r: any): Notification {
  return {
    id: r.id,
    forPhone: r.forPhone,
    kind: r.kind as NotificationKind,
    title: r.title,
    body: r.body,
    href: r.href ?? undefined,
    read: r.read,
    createdAt:
      r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    dedupeKey: r.dedupeKey ?? undefined,
    channel: (r.channel ?? "in-app") as NotificationChannel,
    smsStatus: r.smsStatus ?? undefined,
    smsTo: r.smsTo ?? undefined,
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface CreateNotificationInput {
  forPhone: string
  kind: NotificationKind
  title: string
  body: string
  href?: string
  userId?: string
  /** Stable idempotency key; if a row with this key exists, no-op. */
  dedupeKey?: string
  /** When true, also dispatch an SMS through the provider seam. */
  sms?: boolean
}

/**
 * Create a notification (idempotent on dedupeKey). Returns the created
 * notification, or null when it was a duplicate (already existed). When
 * `sms` is set, attempts an SMS dispatch and records the outcome on the row.
 */
export async function createNotification(
  input: CreateNotificationInput,
): Promise<Notification | null> {
  const id = `n_${crypto.randomUUID()}`
  const wantsSms = Boolean(input.sms)
  const key = phoneKey(input.forPhone)

  // Insert the in-app row first, guarded by the unique dedupeKey index.
  const inserted = await db
    .insert(notificationsTable)
    .values({
      id,
      forPhone: key,
      userId: input.userId ?? null,
      kind: input.kind,
      title: input.title,
      body: input.body,
      href: input.href ?? null,
      read: false,
      dedupeKey: input.dedupeKey ?? null,
      channel: wantsSms ? "sms" : "in-app",
      smsStatus: wantsSms ? "skipped" : null,
      smsTo: null,
    })
    .onConflictDoNothing({ target: notificationsTable.dedupeKey })
    .returning()

  // Duplicate (dedupeKey already present) — nothing to do, including no SMS.
  if (inserted.length === 0) return null

  const row = inserted[0]

  // Fan out SMS only for freshly-inserted rows, so retries never re-text.
  if (wantsSms) {
    const text = `${input.title}\n${input.body}`
    const result = await sendSms(key, text)
    await db
      .update(notificationsTable)
      .set({
        smsStatus: result.status,
        smsTo: key,
      })
      .where(eq(notificationsTable.id, id))
    return toNotification({ ...row, smsStatus: result.status, smsTo: key })
  }

  return toNotification(row)
}

/** Latest notifications for a customer phone (most recent first). */
export async function getNotificationsForPhone(
  phone: string,
  limit = 40,
): Promise<Notification[]> {
  if (!phone) return []
  const rows = await db
    .select()
    .from(notificationsTable)
    .where(eq(notificationsTable.forPhone, phoneKey(phone)))
    .orderBy(desc(notificationsTable.createdAt))
    .limit(limit)
  return rows.map(toNotification)
}

/** Mark every unread notification for a phone as read. */
export async function markNotificationsReadForPhone(phone: string): Promise<void> {
  if (!phone) return
  await db
    .update(notificationsTable)
    .set({ read: true })
    .where(
      and(
        eq(notificationsTable.forPhone, phoneKey(phone)),
        eq(notificationsTable.read, false),
      ),
    )
}
