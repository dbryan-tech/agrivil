"use server"

import { configuredProviders } from "@/lib/auth"

export type AuthProviders = {
  google: boolean
  apple: boolean
  email: boolean
}

/**
 * Exposes which auth providers are actually configured (i.e. have credentials)
 * so the client can render only the social buttons that will work. This avoids
 * the "provider not found" error that occurs when a button is shown for a
 * provider Better Auth never registered.
 */
export async function getAuthProviders(): Promise<AuthProviders> {
  return configuredProviders()
}
