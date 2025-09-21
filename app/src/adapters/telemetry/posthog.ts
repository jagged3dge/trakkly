import type { TelemetryAdapter, TelemetryEvent } from './types'

export class PosthogTelemetryAdapter implements TelemetryAdapter {
  private enabled = false
  private key?: string
  private host?: string

  constructor(key?: string, host?: string) {
    this.key = key
    this.host = host
  }

  init(): void {
    // Placeholder: integrate posthog-js here when keys are present
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled && !!this.key
  }

  identify(_userId?: string, _traits?: Record<string, any>): void {
    // Placeholder: PostHog identify when enabled
  }

  capture(_event: TelemetryEvent): void {
    if (!this.enabled) return
    // Placeholder: PostHog capture
  }
}
