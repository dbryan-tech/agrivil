import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto"

// ----------------------------------------------------------------------------
// Field-level encryption for sensitive support-chat message bodies.
//
// Algorithm: AES-256-GCM (authenticated encryption — tamper-evident).
// Key: derived once via scrypt from SUPPORT_ENC_KEY, falling back to
//      BETTER_AUTH_SECRET so the app works out of the box without a new env
//      var. The derived 32-byte key is cached for the process lifetime.
//
// Stored format (single string): v1:<iv-b64>:<authTag-b64>:<ciphertext-b64>
// The "v1" prefix lets us rotate algorithms/keys later without ambiguity.
// Values that don't carry the prefix are treated as legacy plaintext and
// returned as-is by decrypt(), so existing seed rows keep working.
// ----------------------------------------------------------------------------

const PREFIX = "v1"
const ALGO = "aes-256-gcm"

let cachedKey: Buffer | null = null

function getKey(): Buffer {
  if (cachedKey) return cachedKey
  const secret =
    process.env.SUPPORT_ENC_KEY ||
    process.env.BETTER_AUTH_SECRET ||
    // Last-resort dev fallback so local boots never crash. NOT for production.
    "agrivil-dev-support-encryption-fallback-key"
  // A fixed, non-secret salt is fine here: the secret itself is high-entropy
  // and per-app. scrypt stretches it into a stable 32-byte AES key.
  cachedKey = scryptSync(secret, "agrivil.support.v1", 32)
  return cachedKey
}

/** Encrypt a UTF-8 string. Empty input returns empty (nothing to protect). */
export function encryptField(plain: string): string {
  if (!plain) return plain
  const iv = randomBytes(12) // 96-bit nonce recommended for GCM
  const cipher = createCipheriv(ALGO, getKey(), iv)
  const ciphertext = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()
  return [
    PREFIX,
    iv.toString("base64"),
    authTag.toString("base64"),
    ciphertext.toString("base64"),
  ].join(":")
}

/**
 * Decrypt a value produced by encryptField. Values without the v1 prefix are
 * assumed to be legacy plaintext and returned unchanged, so the migration is
 * seamless for already-seeded rows. On any failure we fail safe to a redacted
 * marker rather than throwing (a single corrupt row never breaks a thread).
 */
export function decryptField(stored: string): string {
  if (!stored) return stored
  if (!stored.startsWith(PREFIX + ":")) return stored // legacy plaintext
  try {
    const [, ivB64, tagB64, dataB64] = stored.split(":")
    const iv = Buffer.from(ivB64, "base64")
    const authTag = Buffer.from(tagB64, "base64")
    const data = Buffer.from(dataB64, "base64")
    const decipher = createDecipheriv(ALGO, getKey(), iv)
    decipher.setAuthTag(authTag)
    const plain = Buffer.concat([decipher.update(data), decipher.final()])
    return plain.toString("utf8")
  } catch {
    return "[message could not be decrypted]"
  }
}

/** True when a stored value is in the encrypted v1 envelope. */
export function isEncrypted(stored: string): boolean {
  return typeof stored === "string" && stored.startsWith(PREFIX + ":")
}
