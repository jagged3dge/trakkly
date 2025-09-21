import { describe, it, expect, beforeEach } from 'vitest'
import { WebCryptoEngine } from './webcrypto'
import { resetDb } from '../../test/resetDb'
import { db } from '../../db/db'

function u8(...nums: number[]) {
  return new Uint8Array(nums)
}

describe('WebCryptoEngine (PBKDF2 + AES-GCM)', () => {
  beforeEach(async () => {
    await resetDb()
  })

  it('unlocks with passcode, persists wrappedKey and can re-unlock', async () => {
    const engine1 = new WebCryptoEngine()
    expect(engine1.isUnlocked()).toBe(false)

    const ok1 = await engine1.unlockWithPasscode!('pass123')
    expect(ok1).toBe(true)
    expect(engine1.isUnlocked()).toBe(true)

    const prefs = await db.preferences.get('user')
    expect(prefs?.wrappedKey).toBeTruthy()
    expect(prefs?.keySalt).toBeTruthy()
    expect(prefs?.kdf).toBe('pbkdf2')

    // New instance re-unlocks with same passcode
    const engine2 = new WebCryptoEngine()
    const ok2 = await engine2.unlockWithPasscode!('pass123')
    expect(ok2).toBe(true)
    expect(engine2.isUnlocked()).toBe(true)
  })

  it('encrypt/decrypt roundtrip works when unlocked', async () => {
    const engine = new WebCryptoEngine()
    await engine.unlockWithPasscode!('secret')
    const plain = u8(1, 2, 3, 4, 5)
    const cipher = await engine.encrypt!(plain)
    expect(cipher.byteLength).toBeGreaterThan(plain.byteLength) // iv + ciphertext
    const decrypted = await engine.decrypt!(cipher)
    expect(Array.from(decrypted)).toEqual(Array.from(plain))
  })

  it('fails to unlock with wrong passcode', async () => {
    const engine1 = new WebCryptoEngine()
    await engine1.unlockWithPasscode!('right-pass')
    engine1.lock()

    const engine2 = new WebCryptoEngine()
    const ok = await engine2.unlockWithPasscode!('wrong-pass')
    expect(ok).toBe(false)
    expect(engine2.isUnlocked()).toBe(false)
  })
})
