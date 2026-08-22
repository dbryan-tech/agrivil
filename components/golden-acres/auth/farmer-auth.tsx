'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from './session-context'
import { AvatarUpload } from '@/components/golden-acres/image-upload-control'
import { SocialButtons, useSocialProviders } from './social-buttons'
import {
  signInWithPhonePin,
  requestOtp,
  verifyOtp,
  signInWithPassword,
  signUpFarmer,
  DEMO,
} from '@/lib/golden-acres/auth'
import type { GhanaRegion } from '@/lib/golden-acres/types'
import { Loader2, Phone, Mail, Delete, Sparkles, ArrowLeft } from 'lucide-react'

type Mode = 'phone-pin' | 'phone-otp' | 'password'

const REGIONS: GhanaRegion[] = [
  'Greater Accra',
  'Eastern',
  'Ashanti',
  'Volta',
  'Central',
  'Bono',
  'Northern',
  'Upper East',
  'Upper West',
]

export function FarmerAuth() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/farmer'
  const { signIn } = useSession()
  const socialProviders = useSocialProviders()
  const hasSocial = (socialProviders?.length ?? 0) > 0

  const [screen, setScreen] = useState<'signin' | 'signup'>('signin')
  const [mode, setMode] = useState<Mode>('phone-pin')
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpStage, setOtpStage] = useState(false)
  const [otp, setOtp] = useState('')
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const done = () => router.push(next)

  // Numeric keypad helper (PIN + OTP) — large tap targets, no keyboard needed.
  function pad(value: string, setter: (v: string) => void, max: number) {
    return (digit: string) => {
      setError(null)
      if (digit === 'del') setter(value.slice(0, -1))
      else if (value.length < max) setter(value + digit)
    }
  }

  async function submitPin() {
    setBusy(true)
    setError(null)
    const res = await signInWithPhonePin(phone, pin)
    setBusy(false)
    if (res.ok) {
      signIn()
      done()
    } else setError(res.error ?? 'Could not sign in.')
  }

  async function sendOtp() {
    setBusy(true)
    setError(null)
    const res = await requestOtp(phone)
    setBusy(false)
    if (res.ok && res.devOtp) {
      setDevOtp(res.devOtp)
      setOtpStage(true)
    } else setError(res.error ?? 'Could not send code.')
  }

  async function checkOtp() {
    setBusy(true)
    setError(null)
    const res = await verifyOtp(phone, otp)
    setBusy(false)
    if (res.ok) {
      signIn()
      done()
    } else setError(res.error ?? 'Invalid code.')
  }

  async function submitPassword() {
    setBusy(true)
    setError(null)
    const res = await signInWithPassword(email, password, 'farmer')
    setBusy(false)
    if (res.ok) {
      signIn()
      done()
    } else setError(res.error ?? 'Could not sign in.')
  }

  function fillDemo() {
    setMode('phone-pin')
    setPhone(DEMO.farmer.phone)
    setPin(DEMO.farmer.pin)
    setError(null)
  }

  // "SMS code" (phone-otp) is intentionally omitted until an SMS provider
  // (Arkesel/Hubtel) is configured and the Better Auth phoneNumber sendOTP
  // callback is wired. The dormant phone-otp UI block below is ready to
  // re-enable by adding { id: 'phone-otp', label: 'SMS code' } here.
  const tabs: { id: Mode; label: string }[] = [
    { id: 'phone-pin', label: 'Phone + PIN' },
    { id: 'password', label: 'Email' },
  ]

  if (screen === 'signup') {
    return (
      <FarmerSignUp
        onBack={() => setScreen('signin')}
        onDone={() => {
          signIn()
          done()
        }}
      />
    )
  }

  return (
    <div className="ga-rise">
      <h1 className="ga-display-title text-[clamp(26px,3vw,36px)] text-[#211A12]">Farmer sign in</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Sign in to manage harvests, stock, and payouts.
      </p>

      {/* Method tabs */}
      <div className="mt-7 flex gap-x-6 border-b border-[rgba(33,26,18,0.08)]">
        {tabs.map((t) => {
          const active = mode === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setMode(t.id)
                setOtpStage(false)
                setError(null)
              }}
              className={`shrink-0 -mb-px border-b pb-2.5 text-[13.5px] font-medium transition-colors ${
                active ? 'border-[#211A12] font-semibold text-[#211A12]' : 'border-transparent text-[#8A7E72]'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {error && (
        <p className="ga-fade-up mt-5 rounded-xl border border-[rgba(185,28,28,0.25)] bg-[#B91C1C]/5 px-4 py-3 text-[13.5px] font-medium text-[#B91C1C]" role="alert">
          {error}
        </p>
      )}

      {/* Phone + PIN */}
      {mode === 'phone-pin' && (
        <div className="mt-6 space-y-5">
          <PhoneField value={phone} onChange={setPhone} />
          <div>
            <label className="text-sm font-semibold text-foreground">4-digit PIN</label>
            <PinDots length={4} filled={pin.length} />
            <Keypad onPress={pad(pin, setPin, 4)} />
          </div>
          <button
            type="button"
            disabled={busy || phone.length < 9 || pin.length < 4}
            onClick={submitPin}
            className="ga-press flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
          >
            {busy ? <Loader2 className="size-5 animate-spin" /> : 'Sign in'}
          </button>
        </div>
      )}

      {/* Phone + OTP */}
      {mode === 'phone-otp' && (
        <div className="mt-6 space-y-5">
          {!otpStage ? (
            <>
              <PhoneField value={phone} onChange={setPhone} />
              <button
                type="button"
                disabled={busy || phone.length < 9}
                onClick={sendOtp}
                className="ga-press flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
              >
                {busy ? <Loader2 className="size-5 animate-spin" /> : 'Send code'}
              </button>
            </>
          ) : (
            <>
              {devOtp && (
                <p className="rounded-xl border border-[rgba(122,63,28,0.25)] bg-[#7A3F1C]/5 px-4 py-3 text-sm font-medium text-[#7A3F1C]">
                  Demo code: <span className="font-mono tracking-widest">{devOtp}</span>
                </p>
              )}
              <div>
                <label className="text-sm font-semibold text-foreground">
                  Enter the code sent to {phone}
                </label>
                <PinDots length={6} filled={otp.length} />
                <Keypad onPress={pad(otp, setOtp, 6)} />
              </div>
              <button
                type="button"
                disabled={busy || otp.length < 6}
                onClick={checkOtp}
                className="ga-press flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
              >
                {busy ? <Loader2 className="size-5 animate-spin" /> : 'Verify & sign in'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Email + password */}
      {mode === 'password' && (
        <div className="mt-6 space-y-4">
          <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@farm.gh" icon={<Mail className="size-4" />} />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            icon={<Phone className="size-4" />}
          />
          <button
            type="button"
            disabled={busy || !email || !password}
            onClick={submitPassword}
            className="ga-press flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
          >
            {busy ? <Loader2 className="size-5 animate-spin" /> : 'Sign in'}
          </button>
        </div>
      )}

      {hasSocial && (
        <>
          <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or continue with
            <span className="h-px flex-1 bg-border" />
          </div>
          <SocialButtons role="farmer" />
        </>
      )}

      <button
        type="button"
        onClick={fillDemo}
        className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-medium text-[#B7AC9E] hover:text-[#5C5247]"
      >
        <Sparkles className="size-3.5" />
        Use demo credentials
      </button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to AgriVil?{' '}
        <button
          type="button"
          onClick={() => setScreen('signup')}
          className="font-bold text-field underline-offset-4 hover:underline"
        >
          Register your farm
        </button>
      </p>

      <p className="mt-3 text-center text-sm text-muted-foreground">
        Are you a customer?{' '}
        <Link href="/login" className="font-bold text-field underline-offset-4 hover:underline">
          Shop sign in
        </Link>
      </p>
    </div>
  )
}

/* ---------------- Farmer registration ---------------- */
function FarmerSignUp({
  onBack,
  onDone,
}: {
  onBack: () => void
  onDone: () => void
}) {
  const [name, setName] = useState('')
  const [farmName, setFarmName] = useState('')
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [region, setRegion] = useState<GhanaRegion>('Greater Accra')
  const [town, setTown] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [photo, setPhoto] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ready =
    name.trim().length >= 2 &&
    farmName.trim().length >= 2 &&
    phone.replace(/\D/g, '').length >= 9 &&
    pin.length === 4 &&
    town.trim().length > 0

  async function submit() {
    setBusy(true)
    setError(null)
    const res = await signUpFarmer({
      name,
      farmName,
      phone,
      pin,
      region,
      town,
      email: email || undefined,
      bio: bio || undefined,
      photo: photo || undefined,
    })
    if (!res.ok) {
      setBusy(false)
      setError(res.error ?? 'Could not create your account.')
      return
    }
    // signUpFarmer already created the public Farmer profile server-side and
    // Better Auth has set the session cookie. Hydrate + navigate.
    onDone()
  }

  return (
    <div className="ga-rise">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to sign in
      </button>

      <h1 className="ga-display-title text-[clamp(26px,3vw,36px)] text-[#211A12]">
        Register your farm.
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Create your supplier account. Your farm appears in the market the moment
        you list produce.
      </p>

      {error && (
        <p
          className="ga-fade-up mt-5 rounded-xl border border-[rgba(185,28,28,0.25)] bg-[#B91C1C]/5 px-4 py-3 text-[13.5px] font-medium text-[#B91C1C]"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col items-center">
        <AvatarUpload
          value={photo}
          onChange={setPhoto}
          fallback={(name.trim()[0] || 'F').toUpperCase()}
          alt="Your profile photo"
        />
      </div>

      <div className="mt-6 space-y-4">
        <SignUpField label="Your name">
          <input
            className="ga-underline"
            placeholder="Kwame Mensah"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </SignUpField>

        <SignUpField label="Farm name">
          <input
            className="ga-underline"
            placeholder="Mensah Family Farm"
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
          />
        </SignUpField>

        <PhoneField value={phone} onChange={setPhone} />

        <div>
          <label className="text-sm font-semibold text-foreground">
            Choose a 4-digit PIN
          </label>
          <PinDots length={4} filled={pin.length} />
          <Keypad
            onPress={(d) => {
              setError(null)
              if (d === 'del') setPin((p) => p.slice(0, -1))
              else if (pin.length < 4) setPin((p) => p + d)
            }}
          />
        </div>

        <SignUpField label="Region">
          <select
            className="ga-underline"
            value={region}
            onChange={(e) => setRegion(e.target.value as GhanaRegion)}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </SignUpField>

        <SignUpField label="Nearest town">
          <input
            className="ga-underline"
            placeholder="Dodowa"
            value={town}
            onChange={(e) => setTown(e.target.value)}
          />
        </SignUpField>

        <SignUpField label="Email (optional)">
          <input
            type="email"
            className="ga-underline"
            placeholder="you@farm.gh"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </SignUpField>

        <SignUpField label="Short bio (optional)">
          <input
            className="ga-underline"
            placeholder="Third-generation vegetable grower"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </SignUpField>

        <button
          type="button"
          disabled={busy || !ready}
          onClick={submit}
          className="ga-press flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
        >
          {busy ? <Loader2 className="size-5 animate-spin" /> : 'Create farm account'}
        </button>
      </div>
    </div>
  )
}

function SignUpField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}

function PhoneField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-semibold text-foreground">Mobile number</label>
      <div className="mt-1.5 mt-1 flex items-center gap-2 border-b border-[rgba(33,26,18,0.15)] px-0 pb-2 transition-colors focus-within:border-[#0B3B25]">
        <span className="ga-index pt-2 text-[15px] font-medium text-[#8A7E72]">+233</span>
        <input
          inputMode="tel"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9\s]/g, ''))}
          placeholder="024 551 1137"
          className="h-10 w-full border-0 bg-transparent ga-index font-medium tracking-wide text-[#211A12] outline-none placeholder:text-[#B7AC9E]"
        />
      </div>
    </div>
  )
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  icon: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="ga-input pl-10"
        />
      </span>
    </label>
  )
}

function PinDots({ length, filled }: { length: number; filled: number }) {
  return (
    <div className="mt-2 flex justify-center gap-3">
      {Array.from({ length }).map((_, i) => (
        <span
          key={i}
          className={`size-4 rounded-full transition-colors ${i < filled ? 'bg-[#0B3B25]' : 'bg-[rgba(33,26,18,0.12)]'}`}
        />
      ))}
    </div>
  )
}

function Keypad({ onPress }: { onPress: (digit: string) => void }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']
  return (
    <div className="mt-4 grid grid-cols-3 gap-2.5">
      {keys.map((k, i) =>
        k === '' ? (
          <span key={i} />
        ) : (
          <button
            key={i}
            type="button"
            onClick={() => onPress(k)}
            className="flex h-14 items-center justify-center rounded-[16px] border border-[rgba(33,26,18,0.10)] bg-white text-xl font-semibold tabular-nums text-[#211A12] transition-colors hover:border-[rgba(11,59,37,0.35)] active:bg-[#F2EEE6]"
            aria-label={k === 'del' ? 'Delete' : k}
          >
            {k === 'del' ? <Delete className="size-5" /> : k}
          </button>
        ),
      )}
    </div>
  )
}
