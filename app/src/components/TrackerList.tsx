import { useEffect, useState } from 'react'
import { useTrakkly } from '../state/store'

export function TrackerList() {
  const { trackers, init, createTracker, increment } = useTrakkly()
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    init()
  }, [init])

  async function handleQuickAdd() {
    setCreating(true)
    try {
      await createTracker({
        name: `New Tracker ${trackers.length + 1}`,
        color: '#4f46e5',
        icon: 'hash',
        tags: [],
        stepSize: 1,
        pinned: false,
      })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Your Trackers</h2>
        <button
          onClick={handleQuickAdd}
          disabled={creating}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {creating ? 'Adding…' : 'Quick Add'}
        </button>
      </div>
      {trackers.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No trackers yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-3">
          {trackers.map((t) => (
            <li key={t.id} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-neutral-500">step {t.stepSize}</div>
                </div>
                <button
                  onClick={() => increment(t.id)}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                  +{t.stepSize}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
