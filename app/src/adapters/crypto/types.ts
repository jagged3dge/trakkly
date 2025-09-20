export interface CryptoEngine {
  isUnlocked(): boolean;
  lock(): void;
  // Unlock using device (WebAuthn) when supported
  unlockWithDevice?(): Promise<boolean>;
  // Unlock using passcode-derived key
  unlockWithPasscode?(passcode: string): Promise<boolean>;
  // Encryption primitives (placeholders for now)
  encrypt?(plain: Uint8Array): Promise<Uint8Array>;
  decrypt?(cipher: Uint8Array): Promise<Uint8Array>;
}
