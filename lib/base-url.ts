// Single source of truth for the app's own origin. Used by Better Auth and by
// the simulated 3PL service when it needs to call back into our webhook routes.
export function getBaseURL(): string {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.V0_RUNTIME_URL) return process.env.V0_RUNTIME_URL
  return "http://localhost:3000"
}

// Origin for server-to-server calls the app makes *to itself* (e.g. the
// simulated 3PL posting to our own /api/3pl/webhook). This must bypass any
// preview/proxy gateway: in the v0 preview runtime the public vusercontent URL
// is auth-walled and redirects server POSTs, so we hit the local dev server
// directly. In real deployments the platform URL serves itself fine.
export function getInternalBaseURL(): string {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}
