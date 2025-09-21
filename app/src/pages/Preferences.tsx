import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { usePrefs } from '../state/prefs'
import { useAdapters } from '../providers/AdaptersProvider'

export default function Preferences() {
  const { prefs, loaded, load, setTimezone, setLocale, setClockFormat, setReducedMotion, setHighContrast, setTelemetryEnabled, setDeviceUnlockEnabled, setDeviceCredentialId, setAutoLockMinutes } = usePrefs()
  const { crypto, deviceUnlock } = useAdapters()
  const navigate = useNavigate()
  const [deviceSupported, setDeviceSupported] = useState<boolean>(false)
  const [deviceBusy, setDeviceBusy] = useState<boolean>(false)
  const [deviceMsg, setDeviceMsg] = useState<string>('')
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [pwBusy, setPwBusy] = useState(false)
  const [pwMsg, setPwMsg] = useState<string>('')

  useEffect(() => {
    if (!loaded) void load()
  }, [loaded, load])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const ok = await deviceUnlock.isSupported()
        if (mounted) setDeviceSupported(ok)
      } catch {
        if (mounted) setDeviceSupported(false)
      }
    })()
    return () => { mounted = false }
  }, [deviceUnlock])

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

      <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <div className="mb-2 font-medium">Privacy</div>
        <div className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">
          Telemetry is opt-in. When enabled, crash and product analytics may be collected (if keys are configured). No sensitive data is sent.
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!prefs.telemetryEnabled}
            onChange={(e) => setTelemetryEnabled(e.target.checked)}
          />
          Enable telemetry
        </label>
      </div>

      <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <div className="mb-2 font-medium">Security</div>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">Lock the app now. You will need your passcode to unlock.</p>
        <button
          onClick={() => { crypto.lock(); navigate({ to: '/lock' }) }}
          className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Lock now
        </button>
        <div className="mt-3">
          <label htmlFor="auto-lock" className="block text-sm mb-1">Auto-lock after (minutes)</label>
          <input
            id="auto-lock"
            type="number"
            min={0}
            step={1}
            value={typeof prefs.autoLockMinutes === 'number' ? prefs.autoLockMinutes : ''}
            onChange={(e) => {
              const v = e.target.value
              const n = v === '' ? undefined : Math.max(0, Math.floor(Number(v)))
              void setAutoLockMinutes(n)
            }}
            placeholder="5"
            className="w-36 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <div className="mt-1 text-xs text-neutral-500">Set to 0 to disable auto-lock.</div>
        </div>
        <div className="mt-4">
          <div className="mb-2 font-medium">Change passcode</div>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setPwMsg('')
              if (newPass.length < 4) { setPwMsg('Passcode must be at least 4 characters.'); return }
              if (newPass !== confirmPass) { setPwMsg('New passcodes do not match.'); return }
              setPwBusy(true)
              try {
                const ok = await crypto.changePasscode?.(oldPass, newPass)
                if (ok) {
                  setPwMsg('Passcode changed successfully.')
                  setOldPass(''); setNewPass(''); setConfirmPass('')
                } else {
                  setPwMsg('Incorrect current passcode. Please try again.')
                }
              } finally {
                setPwBusy(false)
              }
            }}
            className="space-y-2"
          >
            <div>
              <label htmlFor="old-pass" className="block text-sm mb-1">Current passcode</label>
              <input
                id="old-pass"
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="new-pass" className="block text-sm mb-1">New passcode</label>
                <input
                  id="new-pass"
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
              <div>
                <label htmlFor="confirm-pass" className="block text-sm mb-1">Confirm new passcode</label>
                <input
                  id="confirm-pass"
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
            </div>
            {pwMsg && <div className="text-xs text-neutral-600 dark:text-neutral-300">{pwMsg}</div>}
            <div className="pt-1">
              <button
                type="submit"
                disabled={pwBusy || oldPass.length === 0 || newPass.length === 0 || confirmPass.length === 0}
                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800 disabled:opacity-50"
              >
                {pwBusy ? 'Updating…' : 'Update passcode'}
              </button>
            </div>
          </form>
        </div>
        <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <div className="mb-2 font-medium">Device unlock (beta)</div>
          <div className="text-xs text-neutral-600 dark:text-neutral-300 mb-2">
            {deviceSupported ? 'Your device supports WebAuthn.' : 'WebAuthn not supported in this environment.'}
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!prefs.deviceUnlockEnabled}
              onChange={(e) => setDeviceUnlockEnabled(e.target.checked)}
              disabled={!deviceSupported}
            />
            Enable device unlock
          </label>
          {prefs.deviceUnlockEnabled && deviceSupported && (
            <div className="mt-3 space-y-2">
              <div className="text-xs text-neutral-500">Credential: {prefs.deviceCredentialId ? 'Registered' : 'Not registered'}</div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    setDeviceBusy(true); setDeviceMsg('')
                    try {
                      const res = await deviceUnlock.register()
                      if (res.ok && res.credentialId) {
                        await setDeviceCredentialId(res.credentialId)
                        setDeviceMsg('Device registered successfully.')
                      } else {
                        setDeviceMsg('Registration failed or cancelled.')
                      }
                    } finally {
                      setDeviceBusy(false)
                    }
                  }}
                  disabled={deviceBusy}
                  className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  {deviceBusy ? 'Registering…' : 'Register device'}
                </button>
                <button
                  onClick={async () => {
                    setDeviceBusy(true); setDeviceMsg('')
                    try {
                      const ok = await deviceUnlock.authenticate()
                      setDeviceMsg(ok ? 'Authentication successful.' : 'Authentication failed or cancelled.')
                      if (ok) navigate({ to: '/' })
                    } finally {
                      setDeviceBusy(false)
                    }
                  }}
                  disabled={deviceBusy}
                  className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  {deviceBusy ? 'Checking…' : 'Test device unlock'}
                </button>
              </div>
              {deviceMsg && <div className="text-xs text-neutral-600 dark:text-neutral-300">{deviceMsg}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
