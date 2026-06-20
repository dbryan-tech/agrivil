import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields, emailOTPClient, phoneNumberClient } from "better-auth/client/plugins"
import type { auth } from "./auth"

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    emailOTPClient(),
    phoneNumberClient(), // real phone OTP via SMS
  ],
})

export const { signIn, signUp, signOut, useSession } = authClient
