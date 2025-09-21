import { db } from '../../db/db'
import type { UserPreferences } from '../../db/schema'
import type { CryptoEngine } from './types'

const PREFS_ID = 'user'

function enc(text: string): Uint8Array {
  return new TextEncoder().encode(text)
}

function toB64(arr: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(arr).toString('base64')
  }
  // fallback for browser
  return btoa(String.fromCharCode(...arr))
}

function fromB64(b64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(b64, 'base64'))
  }
  const bin = atob(b64)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
  return arr
}

async function getPrefs(): Promise<UserPreferences> {
  let p = await db.preferences.get(PREFS_ID)
  if (!p) {
    p = { id: PREFS_ID, clockFormat: '24' }
    await db.preferences.put(p)
  }
  return p
}

async function savePrefs(p: UserPreferences) {
  await db.preferences.put(p)
}

export class WebCryptoEngine implements CryptoEngine {
  private dataKey: CryptoKey | null = null

  isUnlocked(): boolean { return this.dataKey !== null }

  lock(): void { this.dataKey = null }

  async unlockWithPasscode(passcode: string): Promise<boolean> {
    const prefs = await getPrefs()
    const iterations = prefs.kdfParams?.iterations || 150_000
    const salt = prefs.keySalt ? fromB64(prefs.keySalt) : crypto.getRandomValues(new Uint8Array(16))

    // Derive KEK (AES-GCM key) via PBKDF2
    const baseKey = await crypto.subtle.importKey('raw', enc(passcode), 'PBKDF2', false, ['deriveKey'])
    const kek = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )

    if (!prefs.wrappedKey) {
      // Generate data key and wrap it using KEK (encrypt raw bytes)
      const dataKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
      const raw = new Uint8Array(await crypto.subtle.exportKey('raw', dataKey))
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const wrapped = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, kek, raw))
      const payload = new Uint8Array(iv.length + wrapped.length)
      payload.set(iv, 0)
      payload.set(wrapped, iv.length)

      prefs.keySalt = toB64(salt)
      prefs.kdf = 'pbkdf2'
      prefs.kdfParams = { iterations }
      prefs.wrappedKey = toB64(payload)
      await savePrefs(prefs)
      this.dataKey = dataKey
      return true
    }

    // Unwrap existing
    const payload = fromB64(prefs.wrappedKey)
    const iv = payload.slice(0, 12)
    const ct = payload.slice(12)
    try {
      const raw = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, kek, ct))
      const dataKey = await crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
      this.dataKey = dataKey
      return true
    } catch {
      this.dataKey = null
      return false
    }
  }

  async encrypt(plain: Uint8Array): Promise<Uint8Array> {
    if (!this.dataKey) throw new Error('locked')
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, this.dataKey, plain))
    const out = new Uint8Array(iv.length + ct.length)
    out.set(iv, 0)
    out.set(ct, iv.length)
    return out
  }

  async decrypt(cipher: Uint8Array): Promise<Uint8Array> {
    if (!this.dataKey) throw new Error('locked')
    const iv = cipher.slice(0, 12)
    const ct = cipher.slice(12)
    const pt = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, this.dataKey, ct))
    return pt
  }
}
