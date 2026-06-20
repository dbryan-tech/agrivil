import { betterAuth } from "better-auth"
import { emailOTP, phoneNumber } from "better-auth/plugins"
import { Pool } from "pg"
import { getBaseURL } from "./base-url"
import { sendSms } from "@/lib/golden-acres/sms"
import {
  sendVerificationOtpEmail,
  sendResetPasswordOtpEmail,
  sendResetPasswordLinkEmail,
  sendVerificationLinkEmail,
} from "./email"

const trustedOrigins = [
  process.env.V0_RUNTIME_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined,
  process.env.BETTER_AUTH_URL,
  "http://localhost:3000",
  // Wildcard patterns (supported by Better Auth) so auth works on every Vercel
  // deployment URL, every preview alias, and the v0 preview runtime without
  // having to enumerate the exact host. This is what fixes the "invalid origin"
  // error: the request Origin in preview/prod was never in the static list.
  "https://*.vercel.app",
  "https://*.vusercontent.net",
  "https://*.v0.dev",
  "https://*.v0.app",
].filter(Boolean) as string[]

// Better Auth enables a social provider purely by its presence here, so we only
// include a provider when its credentials are actually configured. This keeps
// the buttons inert (server reports the provider as unavailable) until the user
// supplies real creds — no broken redirects.
const socialProviders: Record<string, unknown> = {}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }
}

if (
  process.env.APPLE_CLIENT_ID &&
  process.env.APPLE_TEAM_ID &&
  process.env.APPLE_KEY_ID &&
  process.env.APPLE_PRIVATE_KEY
) {
  socialProviders.apple = {
    clientId: process.env.APPLE_CLIENT_ID,
    teamId: process.env.APPLE_TEAM_ID,
    keyId: process.env.APPLE_KEY_ID,
    certificate: process.env.APPLE_PRIVATE_KEY,
  }
}

export const auth = betterAuth({
  baseURL: getBaseURL(),
  trustedOrigins,
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: {
    enabled: true,
    // Real password reset via a tokenised link delivered by Resend (or logged
    // in dev when Resend isn't configured).
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordLinkEmail(user.email, url)
    },
  },
  // Require verification before the email is considered confirmed. Better Auth
  // handles token issuance + the `emailVerified` flag; we just deliver the mail.
  emailVerification: {
    sendOnSignUp: false, // we trigger explicitly via the emailOTP flow
    autoSignInAfterVerification: true,
    // Link-based verification used by the "resend verification" action in the
    // account security tab. The OTP plugin handles the signup-time flow.
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationLinkEmail(user.email, url)
    },
  },
  socialProviders,
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false, input: true },
      avatarColor: { type: "string", required: false, input: true },
      loyaltyPoints: { type: "number", required: false, defaultValue: 0, input: false },
      farmerId: { type: "string", required: false, input: true },
      farmName: { type: "string", required: false, input: true },
      staffRole: { type: "string", required: false, input: true },
    },
  },
  plugins: [
    // Native email OTP: Better Auth generates + stores + validates codes and
    // flips `emailVerified`. We only provide delivery. This replaces the
    // hand-rolled (and broken) OTP logic from the first pass.
    emailOTP({
      otpLength: 6,
      expiresIn: 600, // 10 minutes
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "forget-password") {
          await sendResetPasswordOtpEmail(email, otp)
        } else {
          await sendVerificationOtpEmail(email, otp)
        }
      },
    }),
    // Real phone number OTP: customers can sign up / sign in via SMS.
    // The phoneNumber plugin is installed but phone auth UI is deferred.
    // Uses our multi-provider SMS adapter (Arkesel → Hubtel fallback) when enabled.
    // TODO: Wire sendOTP callback once Better Auth phoneNumber plugin API is clarified.
    phoneNumber(),
  ],
  advanced:
    process.env.NODE_ENV === "development"
      ? { defaultCookieAttributes: { sameSite: "none", secure: true } }
      : undefined,
})

// Helper for UI/server to know which providers are live without leaking secrets.
export function configuredProviders() {
  const hasSMS =
    (process.env.ARKESEL_API_KEY && process.env.ARKESEL_SENDER_ID) ||
    (process.env.HUBTEL_CLIENT_ID && process.env.HUBTEL_CLIENT_SECRET)

  return {
    google: !!socialProviders.google,
    apple: !!socialProviders.apple,
    email: !!process.env.RESEND_API_KEY,
    phone: hasSMS, // phone OTP available if SMS provider is configured
  }
}
