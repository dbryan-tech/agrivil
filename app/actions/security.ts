"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"

// ----------------------------------------------------------------------------
// Account security server actions. Each wraps a Better Auth `auth.api` method,
// forwarding the request headers so the call is scoped to the signed-in user.
// There is no client-trust here — Better Auth re-validates the session cookie
// server-side for every call.
// ----------------------------------------------------------------------------

export interface SessionInfo {
  id: string
  token: string
  createdAt: string
  updatedAt: string
  expiresAt: string
  ipAddress?: string | null
  userAgent?: string | null
  current: boolean
}

export interface LinkedAccount {
  provider: string
  accountId: string
  createdAt: string
}

export interface SecurityOverview {
  email: string
  emailVerified: boolean
  hasPassword: boolean
  sessions: SessionInfo[]
  linkedAccounts: LinkedAccount[]
}

async function requireSession() {
  const h = await headers()
  const session = await auth.api.getSession({ headers: h })
  if (!session?.user) throw new Error("Unauthorized")
  return { h, session }
}

export async function getSecurityOverview(): Promise<SecurityOverview> {
  const { h, session } = await requireSession()

  const [sessions, accounts] = await Promise.all([
    auth.api.listSessions({ headers: h }).catch(() => []),
    auth.api.listUserAccounts({ headers: h }).catch(() => []),
  ])

  // Minimal structural views of the Better Auth rows we read here; keeps the
  // mapping honest without depending on the exact driver row generics.
  type SessionRow = {
    id: string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    expiresAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }
  type AccountRow = {
    id: string
    provider?: string | null
    accountId?: string | null
    createdAt?: Date | string | null
  }

  // The current session's token, used to flag "this device".
  const currentToken = session.session?.token

  const sessionInfos: SessionInfo[] = (sessions as unknown as SessionRow[]).map((s) => ({
    id: s.id,
    token: s.token,
    createdAt: new Date(s.createdAt).toISOString(),
    updatedAt: new Date(s.updatedAt).toISOString(),
    expiresAt: new Date(s.expiresAt).toISOString(),
    ipAddress: s.ipAddress ?? null,
    userAgent: s.userAgent ?? null,
    current: s.token === currentToken,
  }))

  // Sort: current device first, then most recently active.
  sessionInfos.sort((a, b) => {
    if (a.current !== b.current) return a.current ? -1 : 1
    return a.updatedAt < b.updatedAt ? 1 : -1
  })

  const accountRows = accounts as unknown as AccountRow[]
  const linked: LinkedAccount[] = accountRows
    // The credential provider is the email+password record, not an OAuth link.
    .filter((a): a is AccountRow & { provider: string } =>
      Boolean(a.provider) && a.provider !== "credential",
    )
    .map((a) => ({
      provider: a.provider,
      accountId: a.accountId ?? a.id,
      createdAt: new Date(a.createdAt ?? Date.now()).toISOString(),
    }))

  // A user "has a password" if a credential account record exists.
  const hasPassword = accountRows.some((a) => a.provider === "credential")

  return {
    email: session.user.email,
    emailVerified: !!session.user.emailVerified,
    hasPassword,
    sessions: sessionInfos,
    linkedAccounts: linked,
  }
}

export async function changeMyPassword(input: {
  currentPassword: string
  newPassword: string
  revokeOtherSessions: boolean
}): Promise<{ ok: boolean; error?: string }> {
  const { h } = await requireSession()
  if (input.newPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." }
  }
  try {
    await auth.api.changePassword({
      headers: h,
      body: {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
        revokeOtherSessions: input.revokeOtherSessions,
      },
    })
    return { ok: true }
  } catch (err) {
    const msg = (err as { message?: string })?.message || ""
    if (/incorrect|invalid/i.test(msg)) {
      return { ok: false, error: "Your current password is incorrect." }
    }
    return { ok: false, error: msg || "Could not change your password." }
  }
}

export async function revokeSession(token: string): Promise<{ ok: boolean; error?: string }> {
  const { h } = await requireSession()
  try {
    await auth.api.revokeSession({ headers: h, body: { token } })
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as { message?: string })?.message || "Could not sign out that device." }
  }
}

export async function revokeOtherSessions(): Promise<{ ok: boolean; error?: string }> {
  const { h } = await requireSession()
  try {
    await auth.api.revokeOtherSessions({ headers: h })
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as { message?: string })?.message || "Could not sign out other devices." }
  }
}

export async function unlinkProvider(
  provider: string,
  accountId: string,
): Promise<{ ok: boolean; error?: string }> {
  const { h } = await requireSession()
  try {
    await auth.api.unlinkAccount({
      headers: h,
      body: {
        providerId: provider,
        accountId,
      } as unknown as NonNullable<
        Parameters<typeof auth.api.unlinkAccount>[0]
      >["body"],
    })
    return { ok: true }
  } catch (err) {
    const msg = (err as { message?: string })?.message || ""
    // Better Auth blocks unlinking the only credential — surface a friendly note.
    if (/last|only|credential/i.test(msg)) {
      return { ok: false, error: "You can't unlink your only sign-in method." }
    }
    return { ok: false, error: msg || "Could not unlink that account." }
  }
}

export async function resendVerificationEmail(): Promise<{ ok: boolean; error?: string }> {
  const { h, session } = await requireSession()
  try {
    await auth.api.sendVerificationEmail({
      headers: h,
      body: { email: session.user.email, callbackURL: "/account" },
    })
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as { message?: string })?.message || "Could not send the email." }
  }
}
