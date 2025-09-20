import { useEffect, useState } from 'react'
import { useTrakkly } from '../state/store'
import { AddTrackerModal } from './AddTrackerModal'
import { AdjustModal } from './AdjustModal'
import { EventList } from './EventList'

export function TrackerList() {
  const { trackers, init, createTracker, increment, togglePin } = useTrakkly()
  const [creating, setCreating] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [adjustId, setAdjustId] = useState<string | null>(null)
  const [openHistory, setOpenHistory] = useState<Record<string, boolean>>({})
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)

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
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Add Tracker
          </button>
          <button
            onClick={handleQuickAdd}
            disabled={creating}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {creating ? 'Adding…' : 'Quick Add'}
          </button>
        </div>
      </div>
      {trackers.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No trackers yet.</p>
      ) : (
        <>
          <div className="flex items-center justify-end">
            <label className="inline-flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={showPinnedOnly}
                onChange={(e) => setShowPinnedOnly(e.target.checked)}
              />
              <span>Show pinned only</span>
            </label>
          </div>
          <ul className="mt-2 grid grid-cols-1 gap-3">
            {trackers
              .slice()
              .sort((a, b) => {
                // pinned first, then updatedAt desc, then name
                if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
                if (a.updatedAt !== b.updatedAt) return a.updatedAt < b.updatedAt ? 1 : -1
                return a.name.localeCompare(b.name)
              })
              .filter((t) => (showPinnedOnly ? t.pinned : true))
              .map((t) => (
            <li key={t.id} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-neutral-500">step {t.stepSize}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePin(t.id)}
                    className="rounded-lg border border-neutral-300 px-3 py-1 text-xs hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    aria-pressed={t.pinned}
                    aria-label={t.pinned ? 'Unpin tracker' : 'Pin tracker'}
                    title={t.pinned ? 'Unpin' : 'Pin'}
                  >
                    {t.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button
                    onClick={() => increment(t.id)}
                    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                  >
                    +{t.stepSize}
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <button
                  onClick={() => setAdjustId(t.id)}
                  className="rounded-lg border border-neutral-300 px-3 py-1 text-xs hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  Adjust…
                </button>
                <button
                  onClick={() => setOpenHistory((prev) => ({ ...prev, [t.id]: !prev[t.id] }))}
                  className="rounded-lg border border-neutral-300 px-3 py-1 text-xs hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  {openHistory[t.id] ? 'Hide History' : 'Show History'}
                </button>
              </div>
              {openHistory[t.id] && (
                <div className="mt-2">
                  <EventList trackerId={t.id} />
                </div>
              )}
            </li>
          ))}
          </ul>
        </>
      )}
      <AddTrackerModal open={showAdd} onClose={() => setShowAdd(false)} />
      {adjustId && (
        <AdjustModal
          open={!!adjustId}
          trackerId={adjustId}
          onClose={() => setAdjustId(null)}
        />
      )}
    </div>
  )
}
