import { useEffect } from 'react'
import { usePrefs } from '../state/prefs'

export default function Preferences() {
  const { prefs, loaded, load, setTimezone, setLocale, setClockFormat, setReducedMotion, setHighContrast } = usePrefs()

  useEffect(() => {
    if (!loaded) void load()
  }, [loaded, load])

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <div className="mb-2 font-medium">Region</div>
        <div className="space-y-3">
          <div>
            <label htmlFor="pref-locale" className="block text-sm mb-1">Locale (e.g. en-US)</label>
            <input
              id="pref-locale"
              value={prefs.locale || ''}
              onChange={(e) => setLocale(e.target.value || undefined)}
              placeholder="System default"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <div>
            <label htmlFor="pref-timezone" className="block text-sm mb-1">Timezone (IANA, e.g. Asia/Kolkata)</label>
            <input
              id="pref-timezone"
              value={prefs.timezone || ''}
              onChange={(e) => setTimezone(e.target.value || undefined)}
              placeholder="System default"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <div className="mb-2 font-medium">Clock</div>
        <div className="flex gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="clock-format"
              checked={prefs.clockFormat === '12'}
              onChange={() => setClockFormat('12')}
            />
            12-hour
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="clock-format"
              checked={prefs.clockFormat === '24'}
              onChange={() => setClockFormat('24')}
            />
            24-hour
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <div className="mb-2 font-medium">Accessibility</div>
        <div className="flex flex-col gap-2 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!prefs.a11yPrefs?.reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
            />
            Reduced motion
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!prefs.a11yPrefs?.highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
            />
            High contrast
          </label>
        </div>
      </div>
    </div>
  )
}
