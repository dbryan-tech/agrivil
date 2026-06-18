'use client'

import useSWR from 'swr'
import { useState } from 'react'
import {
  Shield,
  Lock,
  Monitor,
  Smartphone,
  Loader2,
  Check,
  Eye,
  EyeOff,
  BadgeCheck,
  MailWarning,
  LogOut,
  Globe,
  Link2,
} from 'lucide-react'
import {
  getSecurityOverview,
  changeMyPassword,
  revokeSession,
  revokeOtherSessions,
  unlinkProvider,
  resendVerificationEmail,
  type SecurityOverview,
  type SessionInfo,
} from '@/app/actions/security'
import { shortDate } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'

const PROVIDER_LABEL: Record<string, string> = {
  google: 'Google',
  apple: 'Apple',
}

function deviceLabel(ua?: string | null) {
  if (!ua) return 'Unknown device'
  const browser = /Edg/i.test(ua)
    ? 'Edge'
    : /Chrome/i.test(ua)
      ? 'Chrome'
      : /Firefox/i.test(ua)
        ? 'Firefox'
        : /Safari/i.test(ua)
          ? 'Safari'
          : 'Browser'
  const os = /Android/i.test(ua)
    ? 'Android'
    : /iPhone|iPad|iOS/i.test(ua)
      ? 'iOS'
      : /Mac/i.test(ua)
        ? 'macOS'
        : /Windows/i.test(ua)
          ? 'Windows'
          : /Linux/i.test(ua)
            ? 'Linux'
            : 'device'
  return `${browser} on ${os}`
}

function isMobile(ua?: string | null) {
  return !!ua && /Android|iPhone|iPad|Mobile/i.test(ua)
}

export function SecurityTab() {
  const { data, isLoading, mutate } = useSWR<SecurityOverview>(
    'security-overview',
    () => getSecurityOverview(),
  )

  if (isLoading || !data) {
    return (
      <div className="ga-rise flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading your security settings…
      </div>
    )
  }

  return (
    <div className="ga-rise max-w-2xl space-y-6">
      <EmailStatus data={data} onChange={() => mutate()} />
      <ChangePassword hasPassword={data.hasPassword} onChanged={() => mutate()} />
      <ActiveSessions sessions={data.sessions} onChange={() => mutate()} />
      <LinkedAccounts data={data} onChange={() => mutate()} />
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-6">{children}</div>
}

function EmailStatus({ data, onChange }: { data: SecurityOverview; onChange: () => void }) {
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  async function resend() {
    setBusy(true)
    const res = await resendVerificationEmail()
    setBusy(false)
    if (res.ok) {
      setSent(true)
      setTimeout(() => setSent(false), 4000)
    }
    onChange()
  }

  return (
    <Card>
      <div className="flex items-start gap-4">
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            data.emailVerified ? 'bg-leaf/15 text-leaf' : 'bg-gold/15 text-gold',
          )}
        >
          {data.emailVerified ? <BadgeCheck className="h-5 w-5" /> : <MailWarning className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="ga-display text-lg font-semibold text-foreground">
            {data.emailVerified ? 'Email verified' : 'Email not verified'}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {data.emailVerified
              ? `${data.email} is confirmed and secure.`
              : `Verify ${data.email} to protect your account and receive order updates.`}
          </p>
          {!data.emailVerified && (
            <button
              type="button"
              onClick={resend}
              disabled={busy || sent}
              className="mt-3 inline-flex h-9 items-center gap-2 rounded-full bg-field px-4 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : sent ? <Check className="h-4 w-4" /> : null}
              {sent ? 'Verification sent' : 'Send verification email'}
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}

function ChangePassword({ hasPassword, onChanged }: { hasPassword: boolean; onChanged: () => void }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [show, setShow] = useState(false)
  const [revokeOthers, setRevokeOthers] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const res = await changeMyPassword({
      currentPassword: current,
      newPassword: next,
      revokeOtherSessions: revokeOthers,
    })
    setBusy(false)
    if (res.ok) {
      setCurrent('')
      setNext('')
      setDone(true)
      setTimeout(() => setDone(false), 3000)
      onChanged()
    } else {
      setError(res.error ?? 'Could not change your password.')
    }
  }

  if (!hasPassword) {
    return (
      <Card>
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-field" />
          <div>
            <h2 className="ga-display text-lg font-semibold text-foreground">Password</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              You sign in with a linked account. Use &ldquo;Forgot password&rdquo; on the sign-in
              page to set a password if you&apos;d like one.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-center gap-2">
        <Lock className="h-5 w-5 text-field" />
        <h2 className="ga-display text-lg font-semibold text-foreground">Change password</h2>
      </div>
      <form onSubmit={submit} className="mt-4 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-foreground">Current password</span>
          <input
            type={show ? 'text' : 'password'}
            className="ga-input"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-foreground">New password</span>
          <span className="relative block">
            <input
              type={show ? 'text' : 'password'}
              className="ga-input pr-10"
              placeholder="At least 8 characters"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </span>
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <input
            type="checkbox"
            checked={revokeOthers}
            onChange={(e) => setRevokeOthers(e.target.checked)}
            className="h-4 w-4 accent-[var(--ga-field)]"
          />
          Sign out other devices
        </label>

        {error && (
          <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm font-medium text-clay" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-field px-6 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-70"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : done ? <Check className="h-4 w-4" /> : null}
          {done ? 'Password updated' : 'Update password'}
        </button>
      </form>
    </Card>
  )
}

function ActiveSessions({ sessions, onChange }: { sessions: SessionInfo[]; onChange: () => void }) {
  const [busyToken, setBusyToken] = useState<string | null>(null)
  const [busyAll, setBusyAll] = useState(false)
  const others = sessions.filter((s) => !s.current)

  async function signOutOne(token: string) {
    setBusyToken(token)
    await revokeSession(token)
    setBusyToken(null)
    onChange()
  }

  async function signOutAll() {
    setBusyAll(true)
    await revokeOtherSessions()
    setBusyAll(false)
    onChange()
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-field" />
          <h2 className="ga-display text-lg font-semibold text-foreground">Active sessions</h2>
        </div>
        {others.length > 0 && (
          <button
            type="button"
            onClick={signOutAll}
            disabled={busyAll}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
          >
            {busyAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Sign out all others
          </button>
        )}
      </div>

      <ul className="mt-4 space-y-3">
        {sessions.map((s) => {
          const Icon = isMobile(s.userAgent) ? Smartphone : Monitor
          return (
            <li
              key={s.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-secondary/40 p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card text-field">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="truncate">{deviceLabel(s.userAgent)}</span>
                    {s.current && (
                      <span className="rounded-full bg-leaf/15 px-2 py-0.5 text-[11px] font-bold text-leaf">
                        This device
                      </span>
                    )}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    {s.ipAddress || 'Unknown IP'} · active {shortDate(s.updatedAt)}
                  </p>
                </div>
              </div>
              {!s.current && (
                <button
                  type="button"
                  onClick={() => signOutOne(s.token)}
                  disabled={busyToken === s.token}
                  className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-clay transition-colors hover:bg-clay/10 disabled:opacity-60"
                >
                  {busyToken === s.token ? 'Signing out…' : 'Sign out'}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function LinkedAccounts({ data, onChange }: { data: SecurityOverview; onChange: () => void }) {
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function unlink(provider: string, accountId: string) {
    setBusy(provider)
    setError(null)
    const res = await unlinkProvider(provider, accountId)
    setBusy(null)
    if (!res.ok) setError(res.error ?? 'Could not unlink.')
    onChange()
  }

  return (
    <Card>
      <div className="flex items-center gap-2">
        <Link2 className="h-5 w-5 text-field" />
        <h2 className="ga-display text-lg font-semibold text-foreground">Linked accounts</h2>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        Social sign-in providers connected to your account.
      </p>

      {data.linkedAccounts.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          No social accounts linked. You sign in with your email and password.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {data.linkedAccounts.map((a) => (
            <li
              key={a.provider}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-secondary/40 p-4"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {PROVIDER_LABEL[a.provider] ?? a.provider}
                </p>
                <p className="text-xs text-muted-foreground">Linked {shortDate(a.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => unlink(a.provider, a.accountId)}
                disabled={busy === a.provider}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-clay transition-colors hover:bg-clay/10 disabled:opacity-60"
              >
                {busy === a.provider ? 'Unlinking…' : 'Unlink'}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="mt-3 rounded-lg bg-clay/10 px-3 py-2 text-sm font-medium text-clay" role="alert">
          {error}
        </p>
      )}
    </Card>
  )
}
