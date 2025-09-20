import type { CryptoEngine } from './types';

export class PlaceholderCryptoEngine implements CryptoEngine {
  private unlocked = false;
  isUnlocked(): boolean { return this.unlocked; }
  lock(): void { this.unlocked = false; }
  async unlockWithDevice(): Promise<boolean> { this.unlocked = true; return true; }
  async unlockWithPasscode(_passcode: string): Promise<boolean> { this.unlocked = true; return true; }
}
