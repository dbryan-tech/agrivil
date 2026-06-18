"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  user as userTable,
  addresses as addressesTable,
  subscriptions as subscriptionsTable,
  wishlist as wishlistTable,
  orders as ordersTable,
} from "@/lib/db/schema"
import type {
  Account,
  CustomerAccount,
  FarmerAccount,
  StaffAccount,
  SavedAddress,
  SubscriptionBox,
} from "@/lib/golden-acres/types"
import { and, desc, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

async function requireUserId() {
  const u = await getSessionUser()
  if (!u) throw new Error("Unauthorized")
  return u.id
}

/**
 * Build the rich domain Account from the DB for the signed-in user.
 * This is the server replacement for the old localStorage account registry.
 */
export async function getCurrentAccount(): Promise<Account | null> {
  const u = await getSessionUser()
  if (!u) return null

  // The Better Auth user carries our additional fields.
  const au = u as typeof u & {
    role?: string
    phone?: string | null
    avatarColor?: string | null
    loyaltyPoints?: number | null
    farmerId?: string | null
    farmName?: string | null
    staffRole?: string | null
  }

  const role = (au.role ?? "customer") as Account["role"]
  const avatarColor = au.avatarColor ?? "var(--ga-field)"
  const joinedAt =
    (u as { createdAt?: Date }).createdAt?.toISOString?.() ?? new Date().toISOString()

  if (role === "farmer") {
    const acct: FarmerAccount = {
      id: u.id,
      role: "farmer",
      name: u.name,
      email: u.email ?? undefined,
      phone: au.phone ?? undefined,
      avatarColor,
      avatarImage: u.image ?? undefined,
      createdVia: "password",
      joinedAt,
      farmerId: au.farmerId ?? "",
      farmName: au.farmName ?? "",
    }
    return acct
  }

  if (role === "staff") {
    const acct: StaffAccount = {
      id: u.id,
      role: "staff",
      name: u.name,
      email: u.email ?? undefined,
      phone: au.phone ?? undefined,
      avatarColor,
      avatarImage: u.image ?? undefined,
      createdVia: "password",
      joinedAt,
      staffRole: (au.staffRole ?? "support") as StaffAccount["staffRole"],
    }
    return acct
  }

  // Customer — hydrate addresses, subscriptions, wishlist, order refs.
  const [addrRows, subRows, wishRows, orderRows] = await Promise.all([
    db.select().from(addressesTable).where(eq(addressesTable.userId, u.id)),
    db.select().from(subscriptionsTable).where(eq(subscriptionsTable.userId, u.id)),
    db.select().from(wishlistTable).where(eq(wishlistTable.userId, u.id)),
    db
      .select({ reference: ordersTable.reference })
      .from(ordersTable)
      .where(eq(ordersTable.userId, u.id))
      .orderBy(desc(ordersTable.createdAt)),
  ])

  const acct: CustomerAccount = {
    id: u.id,
    role: "customer",
    name: u.name,
    email: u.email ?? undefined,
    phone: au.phone ?? undefined,
    avatarColor,
    avatarImage: u.image ?? undefined,
    createdVia: "password",
    joinedAt,
    loyaltyPoints: au.loyaltyPoints ?? 0,
    addresses: addrRows.map((a) => ({
      id: a.id,
      label: a.label,
      recipient: a.recipient,
      phone: a.phone,
      ghanaPostGPS: a.ghanaPostGPS,
      area: a.area,
      region: a.region as SavedAddress["region"],
      isDefault: a.isDefault,
      notes: a.notes ?? undefined,
    })),
    subscriptions: subRows.map((s) => ({
      id: s.id,
      bundleId: s.bundleId,
      bundleName: s.bundleName,
      frequency: s.frequency as SubscriptionBox["frequency"],
      price: s.price,
      nextDelivery: s.nextDelivery,
      status: s.status as SubscriptionBox["status"],
    })),
    orderRefs: orderRows.map((o) => o.reference),
    wishlist: wishRows.map((w) => w.productId),
  }
  return acct
}

/** Update top-level profile fields (name, phone, avatar color/image). */
export async function updateProfile(patch: {
  name?: string
  phone?: string
  avatarColor?: string
  avatarImage?: string
}): Promise<{ ok: boolean }> {
  const userId = await requireUserId()
  const updates: Record<string, unknown> = { updatedAt: new Date() }
  if (patch.name !== undefined) updates.name = patch.name
  if (patch.phone !== undefined) updates.phone = patch.phone
  if (patch.avatarColor !== undefined) updates.avatarColor = patch.avatarColor
  if (patch.avatarImage !== undefined) updates.image = patch.avatarImage
  await db.update(userTable).set(updates).where(eq(userTable.id, userId))
  revalidatePath("/account")
  return { ok: true }
}

/** Toggle a product in the customer's wishlist. Returns the new wishlist. */
export async function toggleWishlist(productId: string): Promise<string[]> {
  const userId = await requireUserId()
  const existing = await db
    .select()
    .from(wishlistTable)
    .where(and(eq(wishlistTable.userId, userId), eq(wishlistTable.productId, productId)))
    .limit(1)

  if (existing.length) {
    await db
      .delete(wishlistTable)
      .where(and(eq(wishlistTable.userId, userId), eq(wishlistTable.productId, productId)))
  } else {
    await db.insert(wishlistTable).values({
      id: `wl-${userId}-${productId}`,
      userId,
      productId,
    })
  }

  const rows = await db.select().from(wishlistTable).where(eq(wishlistTable.userId, userId))
  return rows.map((r) => r.productId)
}

// ---- Addresses ----

export async function addAddress(input: Omit<SavedAddress, "id">): Promise<SavedAddress> {
  const userId = await requireUserId()
  const id = `addr-${Date.now()}`
  if (input.isDefault) {
    await db
      .update(addressesTable)
      .set({ isDefault: false })
      .where(eq(addressesTable.userId, userId))
  }
  await db.insert(addressesTable).values({ id, userId, ...input })
  revalidatePath("/account")
  return { id, ...input }
}

export async function deleteAddress(id: string): Promise<{ ok: boolean }> {
  const userId = await requireUserId()
  await db
    .delete(addressesTable)
    .where(and(eq(addressesTable.id, id), eq(addressesTable.userId, userId)))
  revalidatePath("/account")
  return { ok: true }
}

export async function setDefaultAddress(id: string): Promise<{ ok: boolean }> {
  const userId = await requireUserId()
  await db
    .update(addressesTable)
    .set({ isDefault: false })
    .where(eq(addressesTable.userId, userId))
  await db
    .update(addressesTable)
    .set({ isDefault: true })
    .where(and(eq(addressesTable.id, id), eq(addressesTable.userId, userId)))
  revalidatePath("/account")
  return { ok: true }
}

// ---- Subscriptions ----

export async function setSubscriptionStatus(
  id: string,
  status: SubscriptionBox["status"],
): Promise<{ ok: boolean }> {
  const userId = await requireUserId()
  await db
    .update(subscriptionsTable)
    .set({ status })
    .where(and(eq(subscriptionsTable.id, id), eq(subscriptionsTable.userId, userId)))
  revalidatePath("/account")
  return { ok: true }
}
