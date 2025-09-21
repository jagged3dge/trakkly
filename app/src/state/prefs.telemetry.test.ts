import { describe, it, expect, beforeEach } from 'vitest'
import { usePrefs } from './prefs'
import { resetDb } from '../test/resetDb'
import { db } from '../db/db'

function resetStore() {
  const s = usePrefs.getState()
  usePrefs.setState({
    prefs: {
      id: 'user',
      clockFormat: '24',
      telemetryEnabled: false,
      sentryEnabled: false,
      posthogEnabled: false,
    },
    loading: false,
    loaded: false,
    load: s.load,
    setTimezone: s.setTimezone,
    setLocale: s.setLocale,
    setClockFormat: s.setClockFormat,
    setReducedMotion: s.setReducedMotion,
    setHighContrast: s.setHighContrast,
    setTelemetryEnabled: s.setTelemetryEnabled,
    setSentryEnabled: s.setSentryEnabled,
    setPosthogEnabled: s.setPosthogEnabled,
    setDeviceUnlockEnabled: s.setDeviceUnlockEnabled,
    setDeviceCredentialId: s.setDeviceCredentialId,
    setAutoLockMinutes: s.setAutoLockMinutes,
  })
}

describe('preferences telemetry flags', () => {
  beforeEach(async () => {
    await resetDb()
    resetStore()
  })

  it('persists telemetryEnabled, sentryEnabled, posthogEnabled', async () => {
    await usePrefs.getState().load()
    // toggle on
    await usePrefs.getState().setTelemetryEnabled(true)
    await usePrefs.getState().setSentryEnabled(true)
    await usePrefs.getState().setPosthogEnabled(true)

    const s = usePrefs.getState().prefs
    expect(s.telemetryEnabled).toBe(true)
    expect(s.sentryEnabled).toBe(true)
    expect(s.posthogEnabled).toBe(true)

    const persisted = await db.preferences.get('user')
    expect(persisted?.telemetryEnabled).toBe(true)
    expect(persisted?.sentryEnabled).toBe(true)
    expect(persisted?.posthogEnabled).toBe(true)

    // toggle off
    await usePrefs.getState().setSentryEnabled(false)
    await usePrefs.getState().setPosthogEnabled(false)
    const persisted2 = await db.preferences.get('user')
    expect(persisted2?.sentryEnabled).toBe(false)
    expect(persisted2?.posthogEnabled).toBe(false)
  })
})
