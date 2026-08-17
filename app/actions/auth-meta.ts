"use server"

/**
 * Returns available OAuth providers based on environment configuration.
 * Used by client components to know whether to enable Google/Apple sign-in buttons.
 */
export async function getAuthProviders(): Promise<{
  google: boolean
  apple: boolean
}> {
  return {
    google: Boolean(
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
    ),
    apple: Boolean(
      process.env.APPLE_CLIENT_ID &&
        process.env.APPLE_TEAM_ID &&
        process.env.APPLE_KEY_ID &&
        process.env.APPLE_PRIVATE_KEY,
    ),
  }
}
