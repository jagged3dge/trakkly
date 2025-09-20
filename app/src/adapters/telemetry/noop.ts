import type { TelemetryAdapter, TelemetryEvent } from './types';

export class NoopTelemetryAdapter implements TelemetryAdapter {
  init(): void {}
  setEnabled(_enabled: boolean): void { /* noop */ }
  identify(_userId?: string, _traits?: Record<string, any>): void {}
  capture(_event: TelemetryEvent): void {}
  async flush(): Promise<void> { /* noop */ }
  async shutdown(): Promise<void> { /* noop */ }
}
