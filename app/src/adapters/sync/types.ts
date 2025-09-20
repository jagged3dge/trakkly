export interface SyncAdapter {
  init(): Promise<void> | void;
  setEnabled(enabled: boolean): void;
  // Push a batch of events (already encrypted in post-MVP), returns number accepted
  pushEvents?(events: any[]): Promise<number> | number;
  // Pull new events from remote and merge
  pull?(): Promise<void>;
  // Auto-sync lifecycle
  startAutoSync?(): void;
  stopAutoSync?(): void;
}
