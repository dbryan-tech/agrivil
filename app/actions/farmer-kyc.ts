"use server"

import { desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { farmers as farmersTable } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import type { GhanaRegion } from "@/lib/golden-acres/types"

export type KycStatus = "pending" | "verified" | "rejected"

export interface SellApplicationInput {
  name: string
  farmName: string
  region: GhanaRegion
  town: string
  email: string
  phone: string
  bio: string
}

export interface KycApplicant {
  id: string
  name: string
  farmName: string
  region: string
  town: string
  applicantEmail: string | null
  applicantPhone: string | null
  bio: string
  kycStatus: KycStatus
  kycSubmittedAt: string | null
  kycReviewedAt: string | null
  kycNotes: string | null
  createdAt: string
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function toKycApplicant(r: any): KycApplicant {
  return {
    id: r.id,
    name: r.name,
    farmName: r.farmName,
    region: r.region,
    town: r.town,
    applicantEmail: r.applicantEmail ?? null,
    applicantPhone: r.applicantPhone ?? null,
    bio: r.bio ?? "",
    kycStatus: (r.kycStatus as KycStatus) ?? "pending",
    kycSubmittedAt: r.kycSubmittedAt ?? null,
    kycReviewedAt: r.kycReviewedAt ?? null,
    kycNotes: r.kycNotes ?? null,
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

/**
 * Public submission of a farmer seller onboarding application.
 */
export async function submitSellerApplication(
  input: SellApplicationInput,
): Promise<{ ok: boolean; error?: string; id?: string }> {
  try {
    if (!input.name.trim() || !input.farmName.trim() || !input.phone.trim()) {
      return { ok: false, error: "Please fill in all required fields." }
    }

    const id = `farmer_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const slug = `${input.farmName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}-${Date.now().toString().slice(-4)}`

    const now = new Date().toISOString()

    await db.insert(farmersTable).values({
      id,
      slug,
      name: input.name.trim(),
      farmName: input.farmName.trim(),
      photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
      bio: input.bio.trim() || `Local farm in ${input.town}, ${input.region}.`,
      story: input.bio.trim() || `Sustainable farming in ${input.town}.`,
      methods: ["Good Agricultural Practices (GAP)", "Sustainable"],
      certifications: [],
      region: input.region,
      town: input.town.trim() || "Accra",
      pickupGPS: "GA-000-0000",
      location: { lat: 5.6037, lng: -0.187 },
      farmToHubRadiusKm: 45,
      rating: 5.0,
      reviewCount: 0,
      baselineRating: 5.0,
      baselineReviewCount: 0,
      joinedYear: new Date().getFullYear(),
      onTimeRate: 1.0,
      kycStatus: "pending",
      kycSubmittedAt: now,
      applicantEmail: input.email.trim() || null,
      applicantPhone: input.phone.trim(),
    })

    return { ok: true, id }
  } catch (err) {
    console.error("[Farmer KYC] submit error:", err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to submit application",
    }
  }
}

/**
 * Fetch all KYC applicant records for Admin console review.
 */
export async function getKycApplicants(): Promise<KycApplicant[]> {
  try {
    const rows = await db
      .select()
      .from(farmersTable)
      .orderBy(desc(farmersTable.createdAt))

    return rows.map(toKycApplicant)
  } catch (err) {
    console.error("[Farmer KYC] getApplicants error:", err)
    return []
  }
}

/**
 * Review an applicant (approve as 'verified' or decline as 'rejected').
 */
export async function reviewKycApplicant(
  id: string,
  decision: "verified" | "rejected",
  notes?: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const user = await getSessionUser()
    const now = new Date().toISOString()

    await db
      .update(farmersTable)
      .set({
        kycStatus: decision,
        kycReviewedAt: now,
        kycNotes: notes?.trim() || null,
        updatedAt: new Date(),
      })
      .where(eq(farmersTable.id, id))

    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to review applicant",
    }
  }
}
