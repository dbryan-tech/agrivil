"use server"

// -----------------------------------------------------------------------------
// Farmer KYC / seller verification.
// Public applicants submit via the "Sell on AgriVil" form (creates a `pending`
// farmer row). Staff review the queue and approve/reject. Only `verified`
// farmers + their produce surface on the storefront (see getCatalogSnapshot).
// -----------------------------------------------------------------------------

import { headers } from "next/headers"
import { desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { farmers as farmersTable } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import type { GhanaRegion } from "@/lib/golden-acres/types"
import { revalidatePath } from "next/cache"

export type KycStatus = "pending" | "verified" | "rejected"

export interface KycApplicant {
  id: string
  name: string
  farmName: string
  region: string
  town: string
  bio: string
  applicantEmail: string | null
  applicantPhone: string | null
  kycStatus: KycStatus
  kycSubmittedAt: string | null
  kycReviewedAt: string | null
  kycNotes: string | null
  productCount: number
}

async function requireStaff() {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user as { role?: string } | undefined
  if (!user || (user.role !== "staff" && user.role !== "admin")) {
    throw new Error("Staff access required")
  }
  return user
}

const nowISO = () => new Date().toISOString()

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/* ------------------------------- public form ------------------------------- */

export interface SellApplicationInput {
  name: string
  farmName: string
  region: GhanaRegion
  town: string
  email: string
  phone: string
  bio?: string
}

/**
 * Public "Sell on AgriVil" submission. Creates a farmer row in `pending` state
 * that is invisible to the storefront until a staff member approves it.
 */
export async function submitSellerApplication(
  input: SellApplicationInput,
): Promise<{ ok: boolean; error?: string }> {
  const name = input.name?.trim()
  const farmName = input.farmName?.trim()
  const email = input.email?.trim()
  const phone = input.phone?.trim()
  if (!name || !farmName || !email || !phone || !input.region || !input.town?.trim()) {
    return { ok: false, error: "Please complete every required field." }
  }

  const id = `fapp_${Math.random().toString(36).slice(2, 10)}`
  const baseSlug = slugify(farmName) || slugify(name) || id
  let slug = baseSlug
  const existing = await db
    .select({ id: farmersTable.id })
    .from(farmersTable)
    .where(eq(farmersTable.slug, slug))
    .limit(1)
  if (existing.length) slug = `${baseSlug}-${id.slice(-4)}`

  await db
    .insert(farmersTable)
    .values({
      id,
      slug,
      name,
      farmName,
      photo: "/golden-acres/farmers/placeholder.png",
      bio: input.bio?.trim() || `${farmName} — pending verification.`,
      story: `${name} applied to sell on AgriVil from ${input.town}, ${input.region}.`,
      methods: [],
      certifications: [],
      region: input.region,
      town: input.town.trim(),
      pickupGPS: "GA-000-0000",
      location: { lat: 5.6037, lng: -0.187 },
      farmToHubRadiusKm: 0,
      rating: 0,
      reviewCount: 0,
      joinedYear: new Date().getFullYear(),
      onTimeRate: 100,
      kycStatus: "pending",
      kycSubmittedAt: nowISO(),
      applicantEmail: email,
      applicantPhone: phone,
    })
    .onConflictDoNothing()

  revalidatePath("/admin")
  return { ok: true }
}

/* --------------------------------- queue ----------------------------------- */

/** All KYC applicants for the admin queue, newest submissions first. */
export async function getKycApplicants(): Promise<KycApplicant[]> {
  await requireStaff()
  const rows = await db
    .select()
    .from(farmersTable)
    .orderBy(desc(farmersTable.kycSubmittedAt))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    farmName: r.farmName,
    region: r.region,
    town: r.town,
    bio: r.bio,
    applicantEmail: r.applicantEmail ?? null,
    applicantPhone: r.applicantPhone ?? null,
    kycStatus: (r.kycStatus ?? "verified") as KycStatus,
    kycSubmittedAt: r.kycSubmittedAt ?? null,
    kycReviewedAt: r.kycReviewedAt ?? null,
    kycNotes: r.kycNotes ?? null,
    productCount: 0,
  }))
}

/** Approve or reject a KYC applicant. */
export async function reviewKycApplicant(
  farmerId: string,
  decision: "verified" | "rejected",
  notes?: string,
): Promise<{ ok: boolean }> {
  await requireStaff()
  await db
    .update(farmersTable)
    .set({
      kycStatus: decision,
      kycReviewedAt: nowISO(),
      kycNotes: notes?.trim() || null,
      updatedAt: new Date(),
    })
    .where(eq(farmersTable.id, farmerId))
  revalidatePath("/admin")
  revalidatePath("/farmers")
  return { ok: true }
}
