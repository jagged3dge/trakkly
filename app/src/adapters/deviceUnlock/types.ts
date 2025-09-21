export interface DeviceUnlockAdapter {
  isSupported(): Promise<boolean>;
  register(): Promise<{ ok: boolean; credentialId?: string }>;
  authenticate(): Promise<boolean>;
}
