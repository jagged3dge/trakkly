import type { TelemetryAdapter, TelemetryEvent } from './types'

export class MultiTelemetryAdapter implements TelemetryAdapter {
  private adapters: TelemetryAdapter[]
  private enabled = false

  constructor(adapters: TelemetryAdapter[]) {
    this.adapters = adapters
  }

  init(): void {
    for (const a of this.adapters) a.init?.()
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    for (const a of this.adapters) a.setEnabled(enabled)
  }

  identify(userId?: string, traits?: Record<string, any>): void {
    if (!this.enabled) return
    for (const a of this.adapters) a.identify(userId, traits)
  }

  capture(event: TelemetryEvent): void {
    if (!this.enabled) return
    for (const a of this.adapters) a.capture(event)
  }

  async flush(): Promise<void> {
    for (const a of this.adapters) await a.flush?.()
  }

  async shutdown(): Promise<void> {
    for (const a of this.adapters) await a.shutdown?.()
  }
}
