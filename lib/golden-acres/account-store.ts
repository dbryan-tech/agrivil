// Golden Acres — persistent account registry (front-end / mock phase)
// -----------------------------------------------------------------------------
// This is the durable credential store that makes auth "real" without a
// backend: registered accounts + their secrets (password / PIN) are saved to
// localStorage so they survive sign-out and reload. Seeded demo accounts live
// in code (auth.ts) and are merged in at lookup time.
//
// This is the seam to swap for Better Auth + Neon later: replace the read/write
// helpers with server actions. Secrets here are plaintext because everything is
// local to the browser in the demo — NEVER ship this pattern to production.

import type { Account } from './types'

const STORAGE_KEY = 'ga-accounts-v1'

export interface AccountRecord {
  account: Account
  password?: string
  pin?: string
}

export const norm = (s: string) => s.replace(/[\s+]/g, '').toLowerCase()

function canUseStorage(): boolean {
  return typeof window !== 'undefined'
}

export function loadRegistered(): AccountRecord[] {
  if (!canUseStorage()) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AccountRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveRegistered(records: AccountRecord[]) {
  if (!canUseStorage()) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch {
    /* quota — ignore in demo */
  }
}

/** True if an email is already taken by a registered account. */
export function emailTaken(email: string): boolean {
  const e = norm(email)
  return loadRegistered().some(
    (r) => r.account.email && norm(r.account.email) === e,
  )
}

/** True if a phone is already taken by a registered account. */
export function phoneTaken(phone: string): boolean {
  const p = norm(phone)
  return loadRegistered().some(
    (r) => r.account.phone && norm(r.account.phone) === p,
  )
}

export function findByEmail(email: string): AccountRecord | undefined {
  const e = norm(email)
  return loadRegistered().find(
    (r) => r.account.email && norm(r.account.email) === e,
  )
}

export function findByPhone(phone: string): AccountRecord | undefined {
  const p = norm(phone)
  return loadRegistered().find(
    (r) => r.account.phone && norm(r.account.phone) === p,
  )
}

export function addRegistered(record: AccountRecord): AccountRecord {
  const records = loadRegistered()
  records.push(record)
  saveRegistered(records)
  return record
}

/**
 * Persist profile edits (name, avatar, phone, etc.) back to the registry so
 * the next sign-in reflects them. No-op for seeded accounts that were never
 * registered (their session still updates in memory).
 */
export function persistAccount(account: Account) {
  if (!canUseStorage()) return
  const records = loadRegistered()
  const idx = records.findIndex((r) => r.account.id === account.id)
  if (idx === -1) return
  records[idx] = { ...records[idx], account }
  saveRegistered(records)
}
