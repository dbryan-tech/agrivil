"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { farmers as farmersTable } from "@/lib/db/schema"
import type { GhanaRegion } from "@/lib/golden-acres/types"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// Approx Accra hub coordinates for new-farm placeholder geo.
const HUB = { lat: 5.6037, lng: -0.187 }

export async function createFarmerProfile(input: {
  id: string
  name: string
  farmName: string
  region: GhanaRegion
  town: string
  bio?: string
  photo?: string
}): Promise<{ ok: boolean; id: string }> {
  // Must be the signed-in farmer creating their own profile.
  const session = await auth.api.getSession({ headers: await headers() })
  const u = session?.user as ({ id: string; farmerId?: string } | undefined)
  const ownerUserId = u?.id ?? null

  const baseSlug = slugify(input.farmName) || slugify(input.name) || input.id
  let slug = baseSlug
  const existing = await db.select().from(farmersTable).where(eq(farmersTable.slug, slug)).limit(1)
  if (existing.length) slug = `${baseSlug}-${input.id.slice(-4)}`

  const photo =
    input.photo ||
    `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(input.farmName + " Ghana farmer portrait")}`

  await db
    .insert(farmersTable)
    .values({
      id: input.id,
      slug,
      name: input.name,
      farmName: input.farmName,
      photo,
      bio: input.bio || `${input.farmName} — a family farm in ${input.town}, ${input.region}.`,
      story:
        input.bio ||
        `${input.name} farms near ${input.town} in the ${input.region} region, supplying fresh produce to AgriVil.`,
      methods: [],
      certifications: [],
      region: input.region,
      town: input.town,
      pickupGPS: "GA-000-0000",
      location: { lat: HUB.lat, lng: HUB.lng },
      farmToHubRadiusKm: 0,
      rating: 0,
      reviewCount: 0,
      joinedYear: new Date().getFullYear(),
      onTimeRate: 100,
      ownerUserId,
    })
    .onConflictDoNothing()

  revalidatePath("/farmers")
  revalidatePath("/farmer")
  return { ok: true, id: input.id }
}
