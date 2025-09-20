import type { DeviceUnlockAdapter } from './types';

export class NoopDeviceUnlockAdapter implements DeviceUnlockAdapter {
  async isSupported(): Promise<boolean> { return false; }
  async register(): Promise<boolean> { return false; }
  async authenticate(): Promise<boolean> { return false; }
}
