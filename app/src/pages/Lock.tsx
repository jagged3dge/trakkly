import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAdapters } from '../providers/AdaptersProvider'

export default function Lock() {
  const { crypto } = useAdapters()
  const navigate = useNavigate()
  const [passcode, setPasscode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const ok = await crypto.unlockWithPasscode?.(passcode)
      if (ok) {
        navigate({ to: '/' })
      } else {
        setError('Incorrect passcode. Try again.')
      }
    } catch (err) {
      console.error(err)
      setError('Failed to unlock. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <div className="mb-2 font-medium">App Locked</div>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">Enter your passcode to unlock.</p>
        <form onSubmit={handleUnlock} className="mt-3 space-y-2">
          <label htmlFor="lock-passcode" className="block text-sm">Passcode</label>
          <input
            id="lock-passcode"
            type="password"
            autoFocus
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
          />
          {error && <div role="alert" className="text-sm text-red-600">{error}</div>}
          <div className="pt-2">
            <button
              type="submit"
              disabled={busy || passcode.length === 0}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {busy ? 'Unlocking…' : 'Unlock'}
            </button>
          </div>
        </form>
      </div>
      <div className="rounded-xl border border-neutral-200 p-4 text-sm dark:border-neutral-800">
        <div className="font-medium mb-1">Use device unlock (coming soon)</div>
        <p className="text-neutral-500">This will use your device biometrics when available.</p>
      </div>
    </div>
  )
}
