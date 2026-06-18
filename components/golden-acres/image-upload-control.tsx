'use client'

import { useRef, useState } from 'react'
import { Camera, Loader2, Upload, X } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { uploadImage, type CompressOptions } from '@/lib/golden-acres/image-upload'
import { cn } from '@/lib/utils'

interface BaseProps {
  value?: string
  onChange: (url: string) => void
  /** Compression tuning per use (avatars can be smaller than covers/products). */
  compress?: CompressOptions
  className?: string
  disabled?: boolean
}

/**
 * Circular avatar uploader. Shows the current image (or a monogram fallback)
 * with a camera badge; tapping opens the device picker, compresses the result
 * and uploads it to Vercel Blob, returning a public URL.
 */
export function AvatarUpload({
  value,
  onChange,
  compress = { maxEdge: 512, quality: 0.85 },
  className,
  fallback,
  alt = 'Profile photo',
  disabled,
}: BaseProps & { fallback?: React.ReactNode; alt?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const url = await uploadImage(file, 'avatars', compress)
      onChange(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
        className="group relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-[var(--ga-gold-soft)] disabled:opacity-60"
        aria-label="Change profile photo"
      >
        {value ? (
          <SmartImage src={value} alt={alt} fill className="h-full w-full" />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-secondary text-2xl font-bold text-field">
            {fallback}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-foreground/45 opacity-0 transition-opacity group-hover:opacity-100">
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin text-cream" />
          ) : (
            <Camera className="h-5 w-5 text-cream" />
          )}
        </span>
        {busy && !value && (
          <span className="absolute inset-0 flex items-center justify-center bg-foreground/30">
            <Loader2 className="h-5 w-5 animate-spin text-cream" />
          </span>
        )}
      </button>
      <span className="text-xs font-semibold text-muted-foreground">
        {busy ? 'Uploading…' : 'Tap to change'}
      </span>
      {error && <span className="text-xs font-semibold text-clay">{error}</span>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}

/**
 * Wide banner / cover uploader. Shows the current image with an overlaid
 * "Change cover" affordance, or a dashed dropzone when empty.
 */
export function CoverUpload({
  value,
  onChange,
  compress = { maxEdge: 1600, quality: 0.8 },
  className,
  alt = 'Cover photo',
  disabled,
}: BaseProps & { alt?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const url = await uploadImage(file, 'covers', compress)
      onChange(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'group relative flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors',
          value ? 'border-transparent' : 'border-border bg-card',
        )}
        aria-label="Change cover photo"
      >
        {value ? (
          <>
            <SmartImage src={value} alt={alt} fill className="h-full w-full" />
            <span className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/40 text-sm font-bold text-cream opacity-0 transition-opacity group-hover:opacity-100">
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              Change cover
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-2 text-muted-foreground">
            {busy ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
            <span className="text-sm font-bold text-foreground">
              {busy ? 'Uploading…' : 'Add a cover photo'}
            </span>
            <span className="text-xs">Wide landscape works best</span>
          </span>
        )}
      </button>
      {error && (
        <p className="mt-1.5 text-xs font-semibold text-clay">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}

/**
 * Square product-photo uploader used in the farmer "Add produce" form.
 */
export function ProductPhotoUpload({
  value,
  onChange,
  compress = { maxEdge: 1024, quality: 0.8 },
  className,
  disabled,
}: BaseProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const url = await uploadImage(file, 'products', compress)
      onChange(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative flex h-36 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed transition-colors',
          value
            ? 'border-[var(--ga-leaf)] bg-[var(--ga-leaf)]/8'
            : 'border-border bg-card',
        )}
      >
        {value ? (
          <>
            <SmartImage src={value} alt="Produce photo" fill className="h-full w-full" />
            <span className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/40 text-sm font-bold text-cream opacity-0 transition-opacity hover:opacity-100">
              <Camera className="h-4 w-4" /> Replace photo
            </span>
          </>
        ) : busy ? (
          <>
            <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
            <span className="text-sm font-bold text-foreground">Uploading…</span>
          </>
        ) : (
          <>
            <Camera className="h-7 w-7 text-muted-foreground" />
            <span className="text-sm font-bold text-foreground">Add a photo</span>
            <span className="text-xs text-muted-foreground">
              Auto-compressed for low data
            </span>
          </>
        )}
      </button>
      <div className="mt-1.5 flex items-center justify-between">
        {value && !busy ? (
          <span className="text-xs font-semibold text-[var(--ga-leaf)]">
            Photo added
          </span>
        ) : (
          <span />
        )}
        {value && !busy && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-clay"
          >
            <X className="h-3 w-3" /> Remove
          </button>
        )}
      </div>
      {error && <p className="text-xs font-semibold text-clay">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}
