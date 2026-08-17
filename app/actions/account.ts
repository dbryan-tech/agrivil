"use server"

import { headers } from "next/headers"
import { eq, and } from "drizzle-orm"
import { db } from "@/lib/db"
import {
  user as userTable,
  addresses as addressesTable,
  subscriptions as subscriptionsTable,
  orders as ordersTable,
  wishlist as wishlistTable,
  farmers as farmersTable,
} from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import type {
  Account,
  CustomerAccount,
  FarmerAccount,
  StaffAccount,
  SavedAddress,
  SubscriptionBox,
  UserRole,
  StaffRole,
  GhanaRegion,
  BundleFrequency,
  SubscriptionStatus,
} from "@/lib/golden-acres/types"

async function getSessionUser() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    return session?.user ?? null
  } catch {
    return null
  }
}

/**
 * Returns the full, rich Account object for the currently signed-in Better Auth user.
 */
export async function getCurrentAccount(): Promise<Account | null> {
  try {
    const user = await getSessionUser()
    if (!user) return null

    const role = ((user as { role?: string }).role ?? "customer") as UserRole

    // Fetch user details from DB
    const [userRow] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, user.id))
      .limit(1)

    const avatarColor = userRow?.avatarColor || "bg-emerald-600"
    const loyaltyPoints = Number(userRow?.loyaltyPoints ?? 0)

    if (role === "farmer") {
      const farmerId = userRow?.farmerId || `farmer_${user.id}`
      const farmName = userRow?.farmName || `${user.name}'s Farm`

      const farmerAcct: FarmerAccount = {
        id: user.id,
        role: "farmer",
        name: user.name || "Farmer",
        email: user.email,
        phone: userRow?.phone || undefined,
        avatarColor,
        avatarImage: user.image || undefined,
        createdVia: "password",
        joinedAt: userRow?.createdAt?.toISOString() || new Date().toISOString(),
        farmerId,
        farmName,
      }
      return farmerAcct
    }

    if (role === "staff") {
      const staffAcct: StaffAccount = {
        id: user.id,
        role: "staff",
        name: user.name || "Staff Member",
        email: user.email,
        phone: userRow?.phone || undefined,
        avatarColor,
        avatarImage: user.image || undefined,
        createdVia: "password",
        joinedAt: userRow?.createdAt?.toISOString() || new Date().toISOString(),
        staffRole: ((userRow?.staffRole as StaffRole) || "ops"),
      }
      return staffAcct
    }

    // Customer Account: aggregate addresses, subscriptions, wishlist, orders
    const [dbAddresses, dbSubscriptions, dbWishlist, dbOrders] =
      await Promise.all([
        db
          .select()
          .from(addressesTable)
          .where(eq(addressesTable.userId, user.id)),
        db
          .select()
          .from(subscriptionsTable)
          .where(eq(subscriptionsTable.userId, user.id)),
        db
          .select()
          .from(wishlistTable)
          .where(eq(wishlistTable.userId, user.id)),
        db
          .select({ reference: ordersTable.reference })
          .from(ordersTable)
          .where(eq(ordersTable.userId, user.id)),
      ])

    const addresses: SavedAddress[] = dbAddresses.map((a) => ({
      id: a.id,
      label: a.label,
      recipient: a.recipient,
      phone: a.phone,
      ghanaPostGPS: a.ghanaPostGPS,
      area: a.area,
      region: a.region as GhanaRegion,
      isDefault: Boolean(a.isDefault),
      notes: a.notes ?? undefined,
    }))

    const subscriptions: SubscriptionBox[] = dbSubscriptions.map((s) => ({
      id: s.id,
      bundleId: s.bundleId,
      bundleName: s.bundleName,
      frequency: s.frequency as BundleFrequency,
      price: Number(s.price),
      nextDelivery: s.nextDelivery,
      status: s.status as SubscriptionStatus,
    }))

    const wishlistIds = dbWishlist.map((w) => w.productId)
    const orderRefs = dbOrders.map((o) => o.reference)

    const customerAcct: CustomerAccount = {
      id: user.id,
      role: "customer",
      name: user.name || "Customer",
      email: user.email,
      phone: userRow?.phone || undefined,
      avatarColor,
      avatarImage: user.image || undefined,
      createdVia: "password",
      joinedAt: userRow?.createdAt?.toISOString() || new Date().toISOString(),
      addresses,
      subscriptions,
      orderRefs,
      loyaltyPoints,
      wishlist: wishlistIds,
    }

    return customerAcct
  } catch (err) {
    console.error("[Account] getCurrentAccount failed:", err)
    return null
  }
}

/**
 * Updates profile fields on the current user record.
 */
export async function updateProfile(
  patch: Partial<Account>,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const user = await getSessionUser()
    if (!user) return { ok: false, error: "Not authenticated" }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    }
    if (patch.name) updateData.name = patch.name.trim()
    if (patch.phone) updateData.phone = patch.phone.trim()
    if (patch.avatarColor) updateData.avatarColor = patch.avatarColor
    if (patch.avatarImage) updateData.image = patch.avatarImage

    await db
      .update(userTable)
      .set(updateData)
      .where(eq(userTable.id, user.id))

    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update profile",
    }
  }
}

/**
 * Toggles a product in the user's wishlist.
 */
export async function toggleWishlist(
  productId: string,
): Promise<{ ok: boolean; saved: boolean; error?: string }> {
  try {
    const user = await getSessionUser()
    if (!user) return { ok: false, saved: false, error: "Please sign in to save items." }

    const existing = await db
      .select()
      .from(wishlistTable)
      .where(
        and(
          eq(wishlistTable.userId, user.id),
          eq(wishlistTable.productId, productId),
        ),
      )
      .limit(1)

    if (existing.length > 0) {
      await db
        .delete(wishlistTable)
        .where(
          and(
            eq(wishlistTable.userId, user.id),
            eq(wishlistTable.productId, productId),
          ),
        )
      return { ok: true, saved: false }
    } else {
      const id = `wish_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      await db.insert(wishlistTable).values({
        id,
        userId: user.id,
        productId,
      })
      return { ok: true, saved: true }
    }
  } catch (err) {
    return {
      ok: false,
      saved: false,
      error: err instanceof Error ? err.message : "Failed to update wishlist",
    }
  }
}

/**
 * Gets the current user's wishlist product IDs.
 */
export async function getWishlist(): Promise<string[]> {
  try {
    const user = await getSessionUser()
    if (!user) return []

    const rows = await db
      .select({ productId: wishlistTable.productId })
      .from(wishlistTable)
      .where(eq(wishlistTable.userId, user.id))

    return rows.map((r) => r.productId)
  } catch {
    return []
  }
}
