import { describe, it, expect, beforeEach } from 'vitest'
import { WebCryptoEngine } from './webcrypto'
import { resetDb } from '../../test/resetDb'
import { db } from '../../db/db'

function toB64(arr: Uint8Array): string {
  return Buffer.from(arr).toString('base64')
}
function fromB64(b64: string): Uint8Array {
  return new Uint8Array(Buffer.from(b64, 'base64'))
}

function rand(n: number): Uint8Array {
  const a = new Uint8Array(n)
  crypto.getRandomValues(a)
  return a
}

describe('encryption-at-rest verification', () => {
  beforeEach(async () => {
    await resetDb()
  })

  it('encrypt -> persist (Dexie) -> decrypt roundtrip', async () => {
    const engine = new WebCryptoEngine()
    await engine.unlockWithPasscode!('verify-pass')

    const plain = rand(32)
    const cipher = await engine.encrypt!(plain)

    // Persist to Dexie in preferences as a test field
    const prefs = (await db.preferences.get('user')) || { id: 'user', clockFormat: '24' }
    const testKey = 'encTest' as const
    await db.preferences.put({ ...prefs, [testKey]: toB64(cipher) } as any)

    // Read back and decrypt
    const re = await db.preferences.get('user') as any
    const restored = fromB64(re[testKey])
    const decrypted = await engine.decrypt!(restored)

    expect(Array.from(decrypted)).toEqual(Array.from(plain))
  })

  it('tampering detection: decryption fails if ciphertext modified', async () => {
    const engine = new WebCryptoEngine()
    await engine.unlockWithPasscode!('verify-pass')

    const plain = rand(24)
    const cipher = await engine.encrypt!(plain)

    // Tamper with one byte (e.g., last byte)
    const tampered = new Uint8Array(cipher)
    tampered[tampered.length - 1] = tampered[tampered.length - 1] ^ 0x01

    // Expect decryption to fail (GCM tag mismatch)
    await expect(engine.decrypt!(tampered)).rejects.toBeTruthy()
  })
})
