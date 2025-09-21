import type { DeviceUnlockAdapter } from './types'

function bufToB64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let str = ''
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i])
  const b64 = typeof btoa !== 'undefined' ? btoa(str) : Buffer.from(bytes).toString('base64')
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function randomBytes(n: number): Uint8Array {
  const arr = new Uint8Array(n)
  crypto.getRandomValues(arr)
  return arr
}

export class WebAuthnDeviceUnlockAdapter implements DeviceUnlockAdapter {
  async isSupported(): Promise<boolean> {
    const has = typeof window !== 'undefined' && 'PublicKeyCredential' in window
    if (!has) return false
    try {
      // @ts-ignore
      if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
        // @ts-ignore
        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      }
      return true
    } catch {
      return true
    }
  }

  async register(): Promise<{ ok: boolean; credentialId?: string }> {
    if (!('credentials' in navigator)) return { ok: false }
    const challenge = randomBytes(32)
    const userId = randomBytes(16)
    const rpId = window.location.hostname
    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: { id: rpId, name: 'Trakkly' },
      user: { id: userId, name: 'user', displayName: 'Trakkly User' },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 }, // ES256
        { type: 'public-key', alg: -257 }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        residentKey: 'preferred',
        userVerification: 'required',
      },
      timeout: 60_000,
    }
    try {
      const cred = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential | null
      if (!cred) return { ok: false }
      const rawId = cred.rawId
      const id = bufToB64Url(rawId)
      return { ok: true, credentialId: id }
    } catch (e) {
      console.warn('webauthn register failed', e)
      return { ok: false }
    }
  }

  async authenticate(): Promise<boolean> {
    if (!('credentials' in navigator)) return false
    const challenge = randomBytes(32)
    const publicKey: PublicKeyCredentialRequestOptions = {
      challenge,
      userVerification: 'required',
      timeout: 60_000,
    }
    try {
      const assertion = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential | null
      return !!assertion
    } catch (e) {
      console.warn('webauthn authenticate failed', e)
      return false
    }
  }
}
