// Golden Acres — Auth seam (REAL: Better Auth + Neon)
// -----------------------------------------------------------------------------
// Single place that knows "how" auth works. Every component imports these
// functions; they wrap the real Better Auth *client* (this module runs in the
// browser, so it must NOT import server-only things like `db` or `crypto`).
//
// Role model (all backed by hashed email+password in Better Auth):
//   customer / staff -> email + password
//   farmer           -> phone + 4-digit PIN, mapped to a synthetic email
//
// Email verification + password reset are delegated to Better Auth's native
// emailOTP plugin and forget/reset password endpoints. Delivery is handled by
// Resend in lib/email.ts (server side, via the auth config callbacks).

import type { AuthResult, GhanaRegion, UserRole } from "./types"
import { authClient } from "@/lib/auth-client"
import { createFarmerProfile } from "@/app/actions/farmer-onboarding"

// Farmer phone -> synthetic email used as the Better Auth identifier.
function phoneToEmail(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  return `farmer+${digits}@phone.agrivil.gh`
}

// PIN -> password. Better Auth requires >=8 chars by default, so we pad
// deterministically. This is stable for a given PIN.
function pinToPassword(pin: string): string {
  return `agrivil-pin-${pin}`
}

function mapError(err: unknown): string {
  const msg =
    (err as { message?: string })?.message ||
    (typeof err === "string" ? err : "") ||
    "Something went wrong. Please try again."
  if (/not (enabled|configured)|provider .* not found|no such provider/i.test(msg))
    return "That sign-in method isn't configured yet. Use email and password."
  if (/invalid (email or )?password|credential/i.test(msg))
    return "Incorrect email or password. Try again."
  if (/already exists|duplicate|unique|existing/i.test(msg))
    return "An account with those details already exists. Sign in instead."
  if (/invalid otp|incorrect|expired/i.test(msg))
    return "Invalid or expired code. Request a new one."
  return msg
}

// ---- Email + password ------------------------------------------------------

export async function signInWithPassword(
  email: string,
  password: string,
  _role: UserRole = "customer",
): Promise<AuthResult> {
  if (!email.includes("@")) return { ok: false, error: "Enter a valid email address." }
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." }

  const { error } = await authClient.signIn.email({ email, password })
  if (error) return { ok: false, error: mapError(error) }
  return { ok: true }
}

export async function signUpWithPassword(input: {
  name: string
  email: string
  password: string
  phone?: string
}): Promise<AuthResult> {
  if (input.name.trim().length < 2) return { ok: false, error: "Please enter your name." }
  if (!input.email.includes("@")) return { ok: false, error: "Enter a valid email address." }
  if (input.password.length < 8)
    return { ok: false, error: "Password must be at least 8 characters." }

  const { error } = await authClient.signUp.email({
    email: input.email,
    password: input.password,
    name: input.name.trim(),
    role: "customer",
    phone: input.phone,
  } as Parameters<typeof authClient.signUp.email>[0])
  if (error) return { ok: false, error: mapError(error) }
  return { ok: true }
}

export interface FarmerSignUpInput {
  name: string
  farmName: string
  phone: string
  pin: string
  region: GhanaRegion
  town: string
  email?: string
  bio?: string
  photo?: string
}

export async function signUpFarmer(input: FarmerSignUpInput): Promise<AuthResult> {
  if (input.name.trim().length < 2) return { ok: false, error: "Please enter your name." }
  if (input.farmName.trim().length < 2)
    return { ok: false, error: "Please enter your farm name." }
  if (input.phone.replace(/\D/g, "").length < 9)
    return { ok: false, error: "Enter a valid mobile number." }
  if (input.pin.length !== 4) return { ok: false, error: "Choose a 4-digit PIN." }
  if (!input.town.trim()) return { ok: false, error: "Enter your nearest town." }

  const farmerId = `nf-${Date.now()}`
  const email = input.email && input.email.includes("@") ? input.email : phoneToEmail(input.phone)

  const { error } = await authClient.signUp.email({
    email,
    password: pinToPassword(input.pin),
    name: input.name.trim(),
    role: "farmer",
    phone: input.phone,
    farmerId,
    farmName: input.farmName.trim(),
  } as Parameters<typeof authClient.signUp.email>[0])
  if (error) return { ok: false, error: mapError(error) }

  try {
    await createFarmerProfile({
      id: farmerId,
      name: input.name.trim(),
      farmName: input.farmName.trim(),
      region: input.region,
      town: input.town.trim(),
      bio: input.bio,
      photo: input.photo,
    })
  } catch {
    /* profile creation is best-effort; farmer can complete it later */
  }
  return { ok: true }
}

export async function signInWithPhonePin(phone: string, pin: string): Promise<AuthResult> {
  if (pin.length !== 4) return { ok: false, error: "Enter your 4-digit PIN." }
  const { error } = await authClient.signIn.email({
    email: phoneToEmail(phone),
    password: pinToPassword(pin),
  })
  if (error) return { ok: false, error: "No farmer account for that number/PIN. Sign up to join." }
  return { ok: true }
}

// ---- Real social OAuth -----------------------------------------------------
// Better Auth performs the redirect itself. If the provider isn't configured
// server-side, signIn.social returns an error which we map to a friendly note.
// `callbackURL` is where the browser lands after the OAuth round-trip.

export async function signInWithProvider(
  provider: "google" | "apple",
  _role: UserRole = "customer",
): Promise<AuthResult> {
  const callbackURL =
    typeof window !== "undefined" ? window.location.origin + "/account" : "/account"
  const { error } = await authClient.signIn.social({ provider, callbackURL })
  if (error) return { ok: false, error: mapError(error) }
  // On success the browser is already navigating to the provider; this return
  // is mostly for type-completeness.
  return { ok: true, oauth: provider }
}

// ---- Email verification (native emailOTP) ----------------------------------

export async function requestEmailVerification(email: string): Promise<AuthResult> {
  if (!email.includes("@")) return { ok: false, error: "Enter a valid email address." }
  const { error } = await authClient.emailOtp.sendVerificationOtp({
    email,
    type: "email-verification",
  })
  if (error) return { ok: false, error: mapError(error) }
  return { ok: true }
}

export async function verifyEmailCode(email: string, code: string): Promise<AuthResult> {
  if (!code) return { ok: false, error: "Enter the verification code." }
  const { error } = await authClient.emailOtp.verifyEmail({ email, otp: code })
  if (error) return { ok: false, error: mapError(error) }
  return { ok: true }
}

// ---- Password reset --------------------------------------------------------
// Two supported flows:
//   1. OTP code (works without a domain): requestPasswordResetOtp + resetWithOtp
//   2. Emailed link: requestPasswordReset -> user clicks link -> resetPassword

export async function requestPasswordResetOtp(email: string): Promise<AuthResult> {
  if (!email.includes("@")) return { ok: false, error: "Enter a valid email address." }
  const { error } = await authClient.emailOtp.sendVerificationOtp({
    email,
    type: "forget-password",
  })
  if (error) return { ok: false, error: mapError(error) }
  return { ok: true }
}

export async function resetPasswordWithOtp(
  email: string,
  otp: string,
  newPassword: string,
): Promise<AuthResult> {
  if (newPassword.length < 8)
    return { ok: false, error: "Password must be at least 8 characters." }
  const { error } = await authClient.emailOtp.resetPassword({ email, otp, password: newPassword })
  if (error) return { ok: false, error: mapError(error) }
  return { ok: true }
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (!email.includes("@")) return { ok: false, error: "Enter a valid email address." }
  const redirectTo =
    typeof window !== "undefined" ? window.location.origin + "/reset-password" : "/reset-password"
  // `forgetPassword` collides with the emailOTP plugin's `forgetPassword.emailOtp`
  // namespace in the generated types, so TS sees the base as non-callable even
  // though the runtime proxy resolves it. Cast to the callable signature.
  const forgetPassword = authClient.forgetPassword as unknown as (args: {
    email: string
    redirectTo: string
  }) => Promise<{ error?: { message?: string } | null }>
  const { error } = await forgetPassword({ email, redirectTo })
  if (error) return { ok: false, error: mapError(error) }
  return { ok: true }
}

export async function resetPassword(token: string, newPassword: string): Promise<AuthResult> {
  if (newPassword.length < 8)
    return { ok: false, error: "Password must be at least 8 characters." }
  const { error } = await authClient.resetPassword({ token, newPassword })
  if (error) return { ok: false, error: mapError(error) }
  return { ok: true }
}

// ---- Farmer SMS OTP (dev stub until an SMS provider is wired) ---------------

export async function requestOtp(phone: string): Promise<AuthResult> {
  if (phone.replace(/\D/g, "").length < 9)
    return { ok: false, error: "Enter a valid mobile number." }
  return { ok: true, devOtp: "123456" }
}

export async function verifyOtp(_phone: string, code: string): Promise<AuthResult> {
  if (code !== "123456") return { ok: false, error: "Invalid or expired code." }
  return { ok: false, error: "Please sign in with your PIN to continue." }
}

// Demo credentials surfaced in the UI. Created by scripts/seed-demo-users.ts.
export const DEMO = {
  customer: { email: "nana@example.com", password: "freshfood123" },
  farmer: { phone: "024 551 1137", pin: "1234" },
  staff: { email: "ama@goldenacres.gh", password: "goldenacres123" },
}
