"use server"

import { desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { announcements as announcementsTable } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export type AnnouncementTone = "info" | "promo" | "warning"

export interface Announcement {
  id: string
  message: string
  ctaLabel: string | null
  ctaHref: string | null
  tone: AnnouncementTone
  active: boolean
  createdBy: string | null
  createdAt: string
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function toAnnouncement(r: any): Announcement {
  return {
    id: r.id,
    message: r.message,
    ctaLabel: r.ctaLabel ?? null,
    ctaHref: r.ctaHref ?? null,
    tone: (r.tone as AnnouncementTone) ?? "info",
    active: Boolean(r.active),
    createdBy: r.createdBy ?? null,
    createdAt:
      r.createdAt instanceof Date
        ? r.createdAt.toISOString()
        : String(r.createdAt ?? ""),
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function getSessionUser() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    return session?.user ?? null
  } catch {
    return null
  }
}

/** Lists all announcements (for the Admin manager), newest first. */
export async function listAnnouncements(): Promise<Announcement[]> {
  try {
    const rows = await db
      .select()
      .from(announcementsTable)
      .orderBy(desc(announcementsTable.createdAt))
    return rows.map(toAnnouncement)
  } catch (err) {
    console.error("[Announcements] Failed to list:", err)
    return []
  }
}

/** Returns the newest active announcement for the storefront announcement bar. */
export async function getActiveAnnouncement(): Promise<Announcement | null> {
  try {
    const rows = await db
      .select()
      .from(announcementsTable)
      .where(eq(announcementsTable.active, true))
      .orderBy(desc(announcementsTable.createdAt))
      .limit(1)
    return rows[0] ? toAnnouncement(rows[0]) : null
  } catch {
    return null
  }
}

export async function createAnnouncement(input: {
  message: string
  ctaLabel?: string
  ctaHref?: string
  tone?: AnnouncementTone
}): Promise<{ ok: boolean; error?: string; announcement?: Announcement }> {
  try {
    const user = await getSessionUser()
    const id = `ann_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

    const [row] = await db
      .insert(announcementsTable)
      .values({
        id,
        message: input.message.trim(),
        ctaLabel: input.ctaLabel?.trim() || null,
        ctaHref: input.ctaHref?.trim() || null,
        tone: input.tone ?? "info",
        active: true,
        createdBy: user?.id ?? "system",
      })
      .returning()

    return { ok: true, announcement: toAnnouncement(row) }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to create announcement",
    }
  }
}

export async function setAnnouncementActive(
  id: string,
  active: boolean,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await db
      .update(announcementsTable)
      .set({ active })
      .where(eq(announcementsTable.id, id))
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update announcement",
    }
  }
}

export async function deleteAnnouncement(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await db
      .delete(announcementsTable)
      .where(eq(announcementsTable.id, id))
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to delete announcement",
    }
  }
}
