"use server"

import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { farmers as farmersTable, user as userTable } from "@/lib/db/schema"
import type { GhanaRegion } from "@/lib/golden-acres/types"

export interface FarmerOnboardingInput {
  name: string
  farmName: string
  phone: string
  region: GhanaRegion
  town: string
  pickupGPS: string
  ownerUserId?: string
}

export async function createFarmerProfile(
  input: FarmerOnboardingInput,
): Promise<{ ok: boolean; farmerId?: string; error?: string }> {
  try {
    const farmerId = `farmer_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    const slug = `${input.farmName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}-${Date.now().toString().slice(-4)}`

    await db.insert(farmersTable).values({
      id: farmerId,
      slug,
      name: input.name.trim(),
      farmName: input.farmName.trim(),
      photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
      bio: `Fresh harvest from ${input.farmName} in ${input.town}, ${input.region}.`,
      story: `Dedicated to supplying high-quality, cold-chain-handled produce in ${input.region}.`,
      methods: ["Good Agricultural Practices (GAP)", "Cold-Chain Ready"],
      certifications: [],
      region: input.region,
      town: input.town.trim() || "Accra",
      pickupGPS: input.pickupGPS.trim() || "GA-000-0000",
      location: { lat: 5.6037, lng: -0.187 },
      farmToHubRadiusKm: 50,
      rating: 5.0,
      reviewCount: 0,
      baselineRating: 5.0,
      baselineReviewCount: 0,
      joinedYear: new Date().getFullYear(),
      onTimeRate: 1.0,
      momoProvider: "MTN",
      momoNumber: input.phone.trim(),
      ownerUserId: input.ownerUserId ?? null,
      kycStatus: "verified",
      applicantPhone: input.phone.trim(),
    })

    if (input.ownerUserId) {
      await db
        .update(userTable)
        .set({
          farmerId,
          farmName: input.farmName.trim(),
          role: "farmer",
        })
        .where(eq(userTable.id, input.ownerUserId))
    }

    return { ok: true, farmerId }
  } catch (err) {
    console.error("[Farmer Onboarding] Failed:", err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to create farmer profile",
    }
  }
}
