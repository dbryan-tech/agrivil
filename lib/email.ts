// Email delivery via Resend. When RESEND_API_KEY is unset (e.g. local dev or
// before the user has wired Resend), we fall back to logging the message so the
// auth flows remain testable. Every function returns the code/link it "sent" so
// dev mode can surface it in the UI.

import { Resend } from "resend"

const FROM = process.env.RESEND_FROM_EMAIL || "Golden Acres <onboarding@resend.dev>"

function getClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

/** True when real email delivery is configured. */
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

interface SendArgs {
  to: string
  subject: string
  html: string
  text: string
}

async function send({ to, subject, html, text }: SendArgs): Promise<void> {
  const client = getClient()
  if (!client) {
    // Dev fallback: no provider wired. Log so the flow is testable.
    console.log(`[v0] [email:dev] To: ${to} | ${subject}\n${text}`)
    return
  }
  const { error } = await client.emails.send({ from: FROM, to, subject, html, text })
  if (error) {
    console.log("[v0] [email] Resend error:", error)
    throw new Error("Could not send email. Please try again.")
  }
}

const wrap = (heading: string, body: string) => `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1c1917">
    <h1 style="font-size:20px;margin:0 0 16px;color:#15803d">Golden Acres</h1>
    <h2 style="font-size:16px;margin:0 0 12px">${heading}</h2>
    ${body}
    <p style="font-size:12px;color:#78716c;margin-top:24px;border-top:1px solid #e7e5e4;padding-top:16px">
      Fresh from Ghana's farms to your door. If you didn't request this, you can ignore this email.
    </p>
  </div>`

export async function sendVerificationOtpEmail(to: string, otp: string): Promise<void> {
  await send({
    to,
    subject: `${otp} is your Golden Acres verification code`,
    text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    html: wrap(
      "Verify your email",
      `<p style="font-size:14px;line-height:1.6">Enter this code to verify your email address. It expires in 10 minutes.</p>
       <p style="font-size:32px;font-weight:700;letter-spacing:6px;background:#f0fdf4;border-radius:12px;padding:16px;text-align:center;color:#15803d">${otp}</p>`,
    ),
  })
}

export async function sendResetPasswordOtpEmail(to: string, otp: string): Promise<void> {
  await send({
    to,
    subject: `${otp} is your Golden Acres password reset code`,
    text: `Your password reset code is ${otp}. It expires in 10 minutes.`,
    html: wrap(
      "Reset your password",
      `<p style="font-size:14px;line-height:1.6">Use this code to reset your password. It expires in 10 minutes.</p>
       <p style="font-size:32px;font-weight:700;letter-spacing:6px;background:#fef2f2;border-radius:12px;padding:16px;text-align:center;color:#b91c1c">${otp}</p>`,
    ),
  })
}

export async function sendVerificationLinkEmail(to: string, url: string): Promise<void> {
  await send({
    to,
    subject: "Verify your Golden Acres email",
    text: `Verify your email using this link: ${url}`,
    html: wrap(
      "Verify your email",
      `<p style="font-size:14px;line-height:1.6">Click the button below to confirm your email address.</p>
       <a href="${url}" style="display:inline-block;background:#15803d;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px;margin-top:8px">Verify email</a>`,
    ),
  })
}

export async function sendResetPasswordLinkEmail(to: string, url: string): Promise<void> {
  await send({
    to,
    subject: "Reset your Golden Acres password",
    text: `Reset your password using this link: ${url}`,
    html: wrap(
      "Reset your password",
      `<p style="font-size:14px;line-height:1.6">Click the button below to choose a new password. This link expires in 1 hour.</p>
       <a href="${url}" style="display:inline-block;background:#15803d;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px;margin-top:8px">Reset password</a>`,
    ),
  })
}
