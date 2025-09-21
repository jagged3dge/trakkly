import { describe, it, expect, beforeEach } from 'vitest'
import { usePrefs } from './prefs'
import { resetDb } from '../test/resetDb'
import { db } from '../db/db'

function resetStore() {
  usePrefs.setState({
    prefs: {
      id: 'user',
      timezone: undefined,
      locale: undefined,
      clockFormat: '24',
      a11yPrefs: { reducedMotion: false, highContrast: false },
    },
    loading: false,
    loaded: false,
    load: usePrefs.getState().load,
    setTimezone: usePrefs.getState().setTimezone,
    setLocale: usePrefs.getState().setLocale,
    setClockFormat: usePrefs.getState().setClockFormat,
    setReducedMotion: usePrefs.getState().setReducedMotion,
    setHighContrast: usePrefs.getState().setHighContrast,
  })
}

describe('preferences store', () => {
  beforeEach(async () => {
    await resetDb()
    resetStore()
  })

  it('load seeds defaults when none exist', async () => {
    await usePrefs.getState().load()
    const prefs = usePrefs.getState().prefs
    expect(prefs.id).toBe('user')
    expect(prefs.clockFormat).toBe('24')
    const persisted = await db.preferences.get('user')
    expect(persisted).toBeTruthy()
    expect(persisted?.clockFormat).toBe('24')
  })

  it('setters persist to Dexie and update store state', async () => {
    await usePrefs.getState().load()

    await usePrefs.getState().setTimezone('Asia/Kolkata')
    await usePrefs.getState().setLocale('en-IN')
    await usePrefs.getState().setClockFormat('12')
    await usePrefs.getState().setReducedMotion(true)
    await usePrefs.getState().setHighContrast(true)

    const s = usePrefs.getState().prefs
    expect(s.timezone).toBe('Asia/Kolkata')
    expect(s.locale).toBe('en-IN')
    expect(s.clockFormat).toBe('12')
    expect(s.a11yPrefs?.reducedMotion).toBe(true)
    expect(s.a11yPrefs?.highContrast).toBe(true)

    const persisted = await db.preferences.get('user')
    expect(persisted?.timezone).toBe('Asia/Kolkata')
    expect(persisted?.locale).toBe('en-IN')
    expect(persisted?.clockFormat).toBe('12')
    expect(persisted?.a11yPrefs?.reducedMotion).toBe(true)
    expect(persisted?.a11yPrefs?.highContrast).toBe(true)
  })

  it('telemetryEnabled defaults to false and can be toggled', async () => {
    await usePrefs.getState().load()
    expect(usePrefs.getState().prefs.telemetryEnabled).toBe(false)

    await usePrefs.getState().setTelemetryEnabled(true)
    expect(usePrefs.getState().prefs.telemetryEnabled).toBe(true)
    const persisted = await db.preferences.get('user')
    expect(persisted?.telemetryEnabled).toBe(true)
  })
})
