import type { TelemetryAdapter, TelemetryEvent } from './types'

export class SentryTelemetryAdapter implements TelemetryAdapter {
  private enabled = false
  private dsn?: string

  constructor(dsn?: string) {
    this.dsn = dsn
  }

  init(): void {
    // Placeholder: integrate @sentry/browser here when keys are present
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled && !!this.dsn
  }

  identify(_userId?: string, _traits?: Record<string, any>): void {
    // Placeholder: Sentry setUser, setContext when enabled
  }

  capture(_event: TelemetryEvent): void {
    if (!this.enabled) return
    // Placeholder: Sentry captureMessage/captureEvent
  }
}
