import { create } from 'zustand'
import { db } from '../db/db'
import type { UserPreferences, ClockFormat } from '../db/schema'

const PREFERENCES_ID = 'user'

const defaultPrefs: UserPreferences = {
  id: PREFERENCES_ID,
  timezone: undefined,
  locale: undefined,
  clockFormat: '24',
  a11yPrefs: { reducedMotion: false, highContrast: false },
  telemetryEnabled: false,
}

export type PrefsState = {
  prefs: UserPreferences
  loading: boolean
  loaded: boolean
  load: () => Promise<void>
  setTimezone: (tz?: string) => Promise<void>
  setLocale: (locale?: string) => Promise<void>
  setClockFormat: (format: ClockFormat) => Promise<void>
  setReducedMotion: (value: boolean) => Promise<void>
  setHighContrast: (value: boolean) => Promise<void>
  setTelemetryEnabled: (value: boolean) => Promise<void>
}

async function ensurePrefs(): Promise<UserPreferences> {
  const existing = await db.preferences.get(PREFERENCES_ID)
  if (existing) return existing
  await db.preferences.put(defaultPrefs)
  return defaultPrefs
}

export const usePrefs = create<PrefsState>((set, get) => ({
  prefs: defaultPrefs,
  loading: false,
  loaded: false,

  load: async () => {
    set({ loading: true })
    const prefs = await ensurePrefs()
    set({ prefs, loading: false, loaded: true })
  },

  setTimezone: async (tz) => {
    const current = get().prefs
    const next = { ...current, timezone: tz }
    await db.preferences.put(next)
    set({ prefs: next })
  },

  setLocale: async (locale) => {
    const current = get().prefs
    const next = { ...current, locale }
    await db.preferences.put(next)
    set({ prefs: next })
  },

  setClockFormat: async (format) => {
    const current = get().prefs
    const next = { ...current, clockFormat: format }
    await db.preferences.put(next)
    set({ prefs: next })
  },

  setReducedMotion: async (value) => {
    const current = get().prefs
    const next = { ...current, a11yPrefs: { ...(current.a11yPrefs || {}), reducedMotion: value } }
    await db.preferences.put(next)
    set({ prefs: next })
  },

  setHighContrast: async (value) => {
    const current = get().prefs
    const next = { ...current, a11yPrefs: { ...(current.a11yPrefs || {}), highContrast: value } }
    await db.preferences.put(next)
    set({ prefs: next })
  },

  setTelemetryEnabled: async (value) => {
    const current = get().prefs
    const next = { ...current, telemetryEnabled: value }
    await db.preferences.put(next)
    set({ prefs: next })
  },
}))
