import type { SyncAdapter } from './types';

export class LocalOnlySyncAdapter implements SyncAdapter {
  init(): void {}
  setEnabled(_enabled: boolean): void { /* noop */ }
  async pushEvents(): Promise<number> { return 0; }
  async pull(): Promise<void> { /* noop */ }
  startAutoSync(): void { /* noop */ }
  stopAutoSync(): void { /* noop */ }
}
