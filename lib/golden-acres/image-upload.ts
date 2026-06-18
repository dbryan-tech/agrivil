// Golden Acres — client-side image handling (front-end / mock phase)
// -----------------------------------------------------------------------------
// Uploads have no backend yet, so we resize + compress the selected file in the
// browser to a small JPEG data URL that persists in localStorage alongside the
// rest of the mock store. This is the seam to swap for Vercel Blob later:
// replace `fileToCompressedDataUrl` with an upload that returns a public URL —
// every call site already treats the result as an opaque image string.

export interface CompressOptions {
  /** Longest edge in px; image is scaled down to fit. */
  maxEdge?: number
  /** JPEG quality, 0..1. */
  quality?: number
}

const DEFAULTS: Required<CompressOptions> = {
  maxEdge: 1024,
  quality: 0.82,
}

/** Hard ceiling so a single oversized image can't blow the localStorage quota. */
export const MAX_INPUT_BYTES = 12 * 1024 * 1024 // 12 MB raw file

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Read a File, downscale it so its longest edge is <= maxEdge, and return a
 * compressed JPEG data URL. Falls back to the raw data URL if canvas isn't
 * available (e.g. SSR — though this only runs client-side).
 */
export function fileToCompressedDataUrl(
  file: File,
  opts: CompressOptions = {},
): Promise<string> {
  const { maxEdge, quality } = { ...DEFAULTS, ...opts }

  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error('Please choose an image file.'))
      return
    }
    if (file.size > MAX_INPUT_BYTES) {
      reject(new Error('That image is too large. Please pick one under 12 MB.'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.onload = () => {
      const dataUrl = reader.result as string
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onerror = () => reject(new Error('Could not load that image.'))
      img.onload = () => {
        try {
          const { width, height } = img
          const scale = Math.min(1, maxEdge / Math.max(width, height))
          const w = Math.max(1, Math.round(width * scale))
          const h = Math.max(1, Math.round(height * scale))

          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(dataUrl)
            return
          }
          ctx.drawImage(img, 0, 0, w, h)
          resolve(canvas.toDataURL('image/jpeg', quality))
        } catch {
          resolve(dataUrl)
        }
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  })
}

/** Convert a data URL back into a Blob so it can be uploaded as a file. */
function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, b64] = dataUrl.split(',')
  const mime = /:(.*?);/.exec(meta)?.[1] ?? 'image/jpeg'
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

/**
 * Compress the image in-browser, upload it to Vercel Blob via /api/upload, and
 * return the public URL. This is the production replacement for storing base64
 * data URLs — every call site already treats the result as an opaque image
 * string, so swapping the persisted value to a real URL is transparent.
 *
 * @param folder Logical bucket prefix, e.g. "products" or "farmers".
 */
export async function uploadImage(
  file: File,
  folder = 'uploads',
  opts: CompressOptions = {},
): Promise<string> {
  const dataUrl = await fileToCompressedDataUrl(file, opts)
  const blob = dataUrlToBlob(dataUrl)
  const ext = blob.type.split('/')[1] ?? 'jpg'

  const form = new FormData()
  form.append('file', blob, `${folder}.${ext}`)
  form.append('folder', folder)

  const res = await fetch('/api/upload', { method: 'POST', body: form })
  if (!res.ok) {
    const { error } = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(error ?? 'Upload failed. Please try again.')
  }
  const { url } = (await res.json()) as { url: string }
  return url
}

/** Rough byte size of a data URL (for "compressed to N KB" labels). */
export function dataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(',')
  if (comma < 0) return 0
  const b64 = dataUrl.slice(comma + 1)
  return Math.round((b64.length * 3) / 4)
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
