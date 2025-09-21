import type { DeviceUnlockAdapter } from './types';

export class NoopDeviceUnlockAdapter implements DeviceUnlockAdapter {
  async isSupported(): Promise<boolean> { return false; }
  async register(): Promise<{ ok: boolean; credentialId?: string }> { return { ok: false }; }
  async authenticate(): Promise<boolean> { return false; }
}
