"use server"

import { headers } from "next/headers"
import { desc, eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { supportTickets } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { encryptField, decryptField } from "@/lib/golden-acres/crypto"
import { createNotification } from "@/app/actions/notifications"
import type {
  SupportTicket,
  TicketMessage,
  TicketAttachment,
  TicketCategory,
  TicketStatus,
} from "@/lib/golden-acres/types"

// ----------------------------------------------------------------------------
// DB-backed support chat. Message bodies are encrypted at rest with AES-256-GCM
// (lib/golden-acres/crypto.ts); everything else is plaintext for querying. This
// is staff-readable encryption (protects data at rest / in backups), not
// zero-knowledge E2E — support agents must be able to read tickets.
// ----------------------------------------------------------------------------

const nowISO = () => new Date().toISOString()

/* eslint-disable @typescript-eslint/no-explicit-any */

interface StoredMessage {
  id: string
  author: "customer" | "support"
  authorName: string
  body: string // encrypted envelope at rest
  sentAt: string
  attachments?: TicketAttachment[]
}

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

function isStaff(user: any): boolean {
  return user?.role === "staff" || user?.role === "admin"
}

/** Decrypt every message body for client consumption. */
function decryptMessages(messages: StoredMessage[]): TicketMessage[] {
  return (messages ?? []).map((m) => ({
    id: m.id,
    author: m.author,
    authorName: m.authorName,
    body: decryptField(m.body),
    sentAt: m.sentAt,
    attachments: m.attachments ?? [],
  }))
}

function toTicket(row: any): SupportTicket {
  const iso = (v: any) =>
    typeof v === "string" ? v : v?.toISOString?.() ?? nowISO()
  return {
    id: row.id,
    reference: row.reference,
    userId: row.userId ?? null,
    customerName: row.customerName,
    customerPhone: row.customerPhone ?? undefined,
    customerEmail: row.customerEmail ?? undefined,
    orderRef: row.orderRef ?? undefined,
    category: row.category as TicketCategory,
    subject: row.subject,
    status: row.status as TicketStatus,
    priority: row.priority as SupportTicket["priority"],
    assignedTo: row.assignedTo ?? null,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
    lastMessageAt: row.lastMessageAt ? iso(row.lastMessageAt) : iso(row.updatedAt),
    messages: decryptMessages(row.messages ?? []),
  }
}

/** Generate the next human-friendly CS reference (CS-1043, …). */
async function nextReference(): Promise<string> {
  const [row] = await db
    .select({ reference: supportTickets.reference })
    .from(supportTickets)
    .where(sql`${supportTickets.reference} ~ '^CS-[0-9]+$'`)
    .orderBy(sql`cast(substring(${supportTickets.reference} from 4) as integer) desc`)
    .limit(1)
  const last = row?.reference ? parseInt(row.reference.slice(3), 10) : 1042
  return `CS-${(Number.isFinite(last) ? last : 1042) + 1}`
}

export interface CreateTicketInput {
  customerName: string
  customerPhone?: string
  customerEmail?: string
  orderRef?: string
  category: TicketCategory
  subject: string
  message: string
  attachments?: TicketAttachment[]
}

/** Raise a new support ticket with its first (encrypted) message. */
export async function createTicket(
  input: CreateTicketInput,
): Promise<{ ok: boolean; ticket?: SupportTicket; error?: string }> {
  try {
    const user = await getSessionUser()
    const reference = await nextReference()
    const id = `cs_${crypto.randomUUID()}`
    const ts = nowISO()

    const firstMessage: StoredMessage = {
      id: `m_${crypto.randomUUID()}`,
      author: "customer",
      authorName: input.customerName,
      body: encryptField(input.message.trim()),
      sentAt: ts,
      attachments: input.attachments ?? [],
    }

    const [row] = await db
      .insert(supportTickets)
      .values({
        id,
        reference,
        userId: user?.id ?? null,
        customerName: input.customerName.trim(),
        customerPhone: input.customerPhone?.trim() || null,
        customerEmail: input.customerEmail?.trim() || null,
        orderRef: input.orderRef?.trim() || null,
        category: input.category,
        subject: input.subject.trim(),
        status: "open",
        priority: input.category === "payment" ? "high" : "normal",
        messages: [firstMessage] as any,
        lastMessageAt: new Date(ts),
        createdAt: new Date(ts),
        updatedAt: new Date(ts),
      })
      .returning()

    return { ok: true, ticket: toTicket(row) }
  } catch (e) {
    console.log("[v0] createTicket failed:", e)
    return { ok: false, error: e instanceof Error ? e.message : "Could not create ticket." }
  }
}

/** Fetch a single ticket by reference. Customers may only read their own. */
export async function getTicket(reference: string): Promise<SupportTicket | null> {
  const user = await getSessionUser()
  const [row] = await db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.reference, reference))
    .limit(1)
  if (!row) return null
  if (!isStaff(user)) {
    // Ownership check: customers can only see tickets tied to their user id.
    if (!user || !row.userId || row.userId !== user.id) return null
  }
  return toTicket(row)
}

/** List the signed-in customer's own tickets, newest activity first. */
export async function listMyTickets(): Promise<SupportTicket[]> {
  const user = await getSessionUser()
  if (!user) return []
  const rows = await db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.userId, user.id))
    .orderBy(desc(supportTickets.lastMessageAt))
    .limit(50)
  return rows.map(toTicket)
}

/** Staff-only: the full live queue, newest activity first. */
export async function listAllTickets(): Promise<SupportTicket[]> {
  const user = await getSessionUser()
  if (!isStaff(user)) return []
  const rows = await db
    .select()
    .from(supportTickets)
    .orderBy(desc(supportTickets.lastMessageAt))
    .limit(200)
  return rows.map(toTicket)
}

export interface ReplyInput {
  reference: string
  body: string
  attachments?: TicketAttachment[]
}

/**
 * Append a reply to a ticket. The author side is derived from the session
 * role (staff → "support", otherwise "customer"), never trusted from input.
 */
export async function replyToTicket(
  input: ReplyInput,
): Promise<{ ok: boolean; ticket?: SupportTicket; error?: string }> {
  try {
    const user = await getSessionUser()
    if (!user) return { ok: false, error: "Please sign in to reply." }

    const [row] = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.reference, input.reference))
      .limit(1)
    if (!row) return { ok: false, error: "Ticket not found." }

    const staff = isStaff(user)
    if (!staff && row.userId !== user.id) {
      return { ok: false, error: "You can only reply to your own tickets." }
    }

    const body = input.body.trim()
    if (!body && !(input.attachments && input.attachments.length)) {
      return { ok: false, error: "Message can't be empty." }
    }

    const ts = nowISO()
    const message: StoredMessage = {
      id: `m_${crypto.randomUUID()}`,
      author: staff ? "support" : "customer",
      authorName: (user.name as string) || (staff ? "Support" : row.customerName),
      body: encryptField(body),
      sentAt: ts,
      attachments: input.attachments ?? [],
    }

    const existing = (row.messages ?? []) as StoredMessage[]
    // A customer reply re-opens a resolved ticket; a staff reply on an open
    // ticket moves it to pending (awaiting customer).
    let status = row.status
    if (staff && row.status === "open") status = "pending"
    if (!staff && row.status === "resolved") status = "open"

    const [updated] = await db
      .update(supportTickets)
      .set({
        messages: [...existing, message] as any,
        status,
        lastMessageAt: new Date(ts),
        updatedAt: new Date(ts),
      })
      .where(eq(supportTickets.reference, input.reference))
      .returning()

    // Notify the other party.
    if (staff) {
      await createNotification({
        forPhone: row.customerPhone ?? "",
        userId: row.userId ?? undefined,
        kind: "support",
        title: `Support replied to ${row.reference}`,
        body: body.slice(0, 120) || "You received a new attachment.",
        href: `/help?ticket=${row.reference}`,
        dedupeKey: `${row.reference}:${message.id}`,
      })
    }

    return { ok: true, ticket: toTicket(updated) }
  } catch (e) {
    console.log("[v0] replyToTicket failed:", e)
    return { ok: false, error: e instanceof Error ? e.message : "Could not send reply." }
  }
}

/** Staff-only: change a ticket's status. */
export async function setTicketStatus(
  reference: string,
  status: TicketStatus,
): Promise<{ ok: boolean; ticket?: SupportTicket; error?: string }> {
  const user = await getSessionUser()
  if (!isStaff(user)) return { ok: false, error: "Not authorized." }
  const [updated] = await db
    .update(supportTickets)
    .set({ status, updatedAt: new Date() })
    .where(eq(supportTickets.reference, reference))
    .returning()
  if (!updated) return { ok: false, error: "Ticket not found." }
  return { ok: true, ticket: toTicket(updated) }
}

/** Staff-only: assign a ticket to a staff member (or unassign with null). */
export async function assignTicket(
  reference: string,
  assignedTo: string | null,
): Promise<{ ok: boolean; ticket?: SupportTicket; error?: string }> {
  const user = await getSessionUser()
  if (!isStaff(user)) return { ok: false, error: "Not authorized." }
  const [updated] = await db
    .update(supportTickets)
    .set({ assignedTo, updatedAt: new Date() })
    .where(eq(supportTickets.reference, reference))
    .returning()
  if (!updated) return { ok: false, error: "Ticket not found." }
  return { ok: true, ticket: toTicket(updated) }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
