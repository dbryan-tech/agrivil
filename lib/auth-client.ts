import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields, emailOTPClient } from "better-auth/client/plugins"
import type { auth } from "./auth"

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), emailOTPClient()],
})

export const { signIn, signUp, signOut, useSession } = authClient
