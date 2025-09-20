import { useEffect, useMemo, useState } from 'react'
import { db } from '../db/db'
import type { Event, Tracker } from '../db/schema'
import { isSameDay, isSameWeek } from '../lib/time'

export default function Insights() {
  const [events, setEvents] = useState<Event[]>([])
  const [trackers, setTrackers] = useState<Tracker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [ev, tr] = await Promise.all([db.events.toArray(), db.trackers.toArray()])
      // sort newest first
      ev.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      setEvents(ev)
      setTrackers(tr)
      setLoading(false)
    }
    load()
  }, [])

  const now = new Date()
  const today = useMemo(() => events.filter((e) => isSameDay(new Date(e.createdAt), now)), [events, now])
  const thisWeek = useMemo(
    () => events.filter((e) => isSameWeek(new Date(e.createdAt), now)),
    [events, now],
  )

  function sum(vals: number[]) {
    return vals.reduce((a, b) => a + b, 0)
  }

  const todayCount = sum(today.map((e) => e.value))
  const weekCount = sum(thisWeek.map((e) => e.value))

  const perTrackerToday = useMemo(() => {
    const map = new Map<string, number>()
    today.forEach((e) => map.set(e.trackerId, (map.get(e.trackerId) || 0) + e.value))
    return map
  }, [today])

  const perTrackerWeek = useMemo(() => {
    const map = new Map<string, number>()
    thisWeek.forEach((e) => map.set(e.trackerId, (map.get(e.trackerId) || 0) + e.value))
    return map
  }, [thisWeek])

  if (loading) return <div className="text-sm text-neutral-500">Loading…</div>

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="text-xs text-neutral-500">Today</div>
          <div className="mt-1 text-2xl font-semibold">{todayCount}</div>
        </div>
        <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="text-xs text-neutral-500">This week</div>
          <div className="mt-1 text-2xl font-semibold">{weekCount}</div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <div className="mb-2 font-medium">By tracker — today</div>
        {trackers.length === 0 ? (
          <div className="text-sm text-neutral-500">No trackers yet.</div>
        ) : (
          <ul className="space-y-1">
            {trackers.map((t) => (
              <li key={t.id} className="flex items-center justify-between text-sm">
                <span>{t.name}</span>
                <span className="font-mono">{perTrackerToday.get(t.id) || 0}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <div className="mb-2 font-medium">By tracker — this week</div>
        {trackers.length === 0 ? (
          <div className="text-sm text-neutral-500">No trackers yet.</div>
        ) : (
          <ul className="space-y-1">
            {trackers.map((t) => (
              <li key={t.id} className="flex items-center justify-between text-sm">
                <span>{t.name}</span>
                <span className="font-mono">{perTrackerWeek.get(t.id) || 0}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
