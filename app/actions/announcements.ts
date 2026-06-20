"use server"

import { desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { announcements } from "@/lib/db/schema"

export type AnnouncementTone = "info" | "promo" | "warning"

export type Announcement = {
  id: string
  message: string
  ctaLabel: string | null
  ctaHref: string | null
  tone: AnnouncementTone
  active: boolean
  createdAt: string
}

function toAnnouncement(r: typeof announcements.$inferSelect): Announcement {
  return {
    id: r.id,
    message: r.message,
    ctaLabel: r.ctaLabel ?? null,
    ctaHref: r.ctaHref ?? null,
    tone: (r.tone as AnnouncementTone) ?? "info",
    active: r.active,
    createdAt:
      r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
  }
}

/** The single active banner to render on the storefront (most recent), if any. */
export async function getActiveAnnouncement(): Promise<Announcement | null> {
  const [row] = await db
    .select()
    .from(announcements)
    .where(eq(announcements.active, true))
    .orderBy(desc(announcements.createdAt))
    .limit(1)
  return row ? toAnnouncement(row) : null
}

/** All banners for the Admin console, newest first. */
export async function listAnnouncements(): Promise<Announcement[]> {
  const rows = await db
    .select()
    .from(announcements)
    .orderBy(desc(announcements.createdAt))
  return rows.map(toAnnouncement)
}

export async function createAnnouncement(input: {
  message: string
  ctaLabel?: string
  ctaHref?: string
  tone?: AnnouncementTone
}): Promise<{ ok: boolean; error?: string; announcement?: Announcement }> {
  const message = input.message.trim()
  if (!message) return { ok: false, error: "Message is required." }

  const id = `ann_${Math.random().toString(36).slice(2, 10)}`
  const [row] = await db
    .insert(announcements)
    .values({
      id,
      message: message.slice(0, 240),
      ctaLabel: input.ctaLabel?.trim() || null,
      ctaHref: input.ctaHref?.trim() || null,
      tone: input.tone ?? "info",
      active: true,
    })
    .returning()
  return { ok: true, announcement: toAnnouncement(row) }
}

export async function setAnnouncementActive(
  id: string,
  active: boolean,
): Promise<{ ok: boolean }> {
  await db.update(announcements).set({ active }).where(eq(announcements.id, id))
  return { ok: true }
}

export async function deleteAnnouncement(id: string): Promise<{ ok: boolean }> {
  await db.delete(announcements).where(eq(announcements.id, id))
  return { ok: true }
}
