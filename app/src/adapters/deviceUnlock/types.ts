export interface DeviceUnlockAdapter {
  isSupported(): Promise<boolean>;
  register(): Promise<boolean>;
  authenticate(): Promise<boolean>;
}
