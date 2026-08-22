# 03 — Auth, Onboarding & Location (entry, trust, first-run)

> **Owns:** `app/(auth)/**` + `components/golden-acres/auth/**`
> (auth-shell, customer/farmer/staff auth, social buttons, forgot/reset),
> onboarding/location surfaces reachable from web (`/onboarding`, `/local`,
> GPS/GhanaPostGPS capture), session-context UX states.
> **Job:** make the front door feel like a bank vault wearing cashmere —
> fast, reassuring, and honest about what's happening at every step.

## 1. Current state audit

- `auth-shell.tsx` provides a shared split layout; customer auth supports
  email/password + Google OAuth (real Better Auth wiring exists —
  `lib/auth.ts`, `/api/auth/**` verified live in the RC audit).
- Farmer login is separate (`/farmer/login`, phone/PIN posture); staff login
  at `/support/login`.
- Forgot/reset flows exist. Social buttons component exists.
- Onboarding/location: rich mobile flow (`/m/onboarding/**`) but web lacks a
  coherent equivalent; `/local` exists with mock distance strings.

**Diagnosis:** the mechanics are real and recently hardened; the *presentation*
is generic form-on-card. Trust cues (why we ask for a phone number, how MoMo
numbers are used, session security) are absent.

## 2. Design direction

### 2.1 Auth shell
- Two-pane: left = quiet brand panel (deep green field, wordmark, one rotating
  proof line of farmer/testimonial quotes — no carousel chrome), right =
  canvas with the form. On narrow widths, brand panel collapses to a slim top
  band.
- Forms rebuilt on UnderlineField grammar; 13px sentence-case labels;
  inline validation on blur + submit-attempt; error text in red with exact
  recovery guidance ("That password doesn't match our records.").
- Password field: show/hide toggle, live requirement checklist only when
  focused-and-empty (never nag after).
### 2.2 Sign-in / sign-up
- Email-first pattern: single field → continue → password (or sign-up branch).
  Reduces cognitive load vs. tabbed forms; keeps social buttons above as
  equal-weight rows with provider marks (no colored brand boxes).
- Phone/PIN (farmer) gets its numeric keypad-friendly variant.
- Session-expiry re-auth: modal variant of the same shell, never a redirect
  that loses cart state.
### 2.3 Trust microcopy (new)
- Under social buttons: "We never post anywhere."
- Under phone fields: "Used only for delivery updates and MoMo receipts."
- Under password: "Sessions expire automatically. You can review devices in
  Account → Security." (links to existing security-tab).

## 3. Onboarding & location (web parity)

- **First-run overlay:** after sign-up on web, a 3-step quiet overlay:
  (1) area selection via GhanaPostGPS entry or geolocation button,
  (2) zone verdict (served: celebrate + set delivery expectations;
     unserved: waitlist capture with area recorded),
  (3) dietary staples quick-pick (optional skip). Skippable end-to-end;
  resumable from account.
- **Location components:** underline input with format mask `GA-183-4250`
  style hint, validation state, "Use my location" as text-link with
  permission-state handling (denied → manual entry emphasized, never dead-end).
- **/local rebuild:** replace hardcoded distance strings with real
  `distanceFromHubKm()`/match data where available; shop-local cards adopt
  product card grammar; outside-zone state routes to waitlist.

## 4. States inventory (must all exist)

idle · validating · submitting · success (with next-step) ·
invalid-credentials · duplicate-account · weak-password · rate-limited ·
oauth-cancelled · oauth-provider-error · session-expired · network-offline.
Each designed, not just handled by default browser behavior.

## 5. Security UX requirements

- No secrets in localStorage ever (session cookie stays httpOnly per Better
  Auth defaults).
- Redirect-after-login honors a safe internal allowlist (open-redirect guard).
- Rate-limit feedback surfaces humanly ("Too many attempts. Try again in 2
  minutes.") using server-provided retry hints when present.

## 6. Acceptance checklist

- [ ] All four auth variants (customer/farmer/staff/reset) on new shell.
- [ ] Google OAuth round-trip verified against local Better Auth endpoints.
- [ ] Cart survives login and expiry-re-auth (test: add item → log in →
      item still present).
- [ ] Onboarding overlay skippable/resumable; zone verdict correct for
      pilot vs non-pilot areas.
- [ ] tsc + build clean; `/emu` approval before merge.
