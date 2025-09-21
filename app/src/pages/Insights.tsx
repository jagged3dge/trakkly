import { useEffect, useMemo, useState } from 'react'
import { db } from '../db/db'
import type { Event, Tracker } from '../db/schema'
import { eventsForThisWeek, eventsForToday, sumValue, totalsByDayInWeek, totalsByTracker, binsForToday, sparklinePath, totalsByLastNDays } from '../lib/insights'

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
  const today = useMemo(() => eventsForToday(events, now), [events, now])
  const thisWeek = useMemo(() => eventsForThisWeek(events, now), [events, now])
  const todayCount = useMemo(() => sumValue(today), [today])
  const weekCount = useMemo(() => sumValue(thisWeek), [thisWeek])
  const perTrackerToday = useMemo(() => totalsByTracker(today), [today])
  const perTrackerWeek = useMemo(() => totalsByTracker(thisWeek), [thisWeek])
  const weekDays = useMemo(() => totalsByDayInWeek(events, now), [events, now])
  const todayBins = useMemo(() => binsForToday(events, now), [events, now])
  const todayPath = useMemo(() => sparklinePath(todayBins), [todayBins])
  const last7 = useMemo(() => totalsByLastNDays(events, 7, now), [events, now])

  if (loading) return <div className="text-sm text-neutral-500">Loading…</div>

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="text-xs text-neutral-500">Today</div>
          <div className="mt-1 flex items-end justify-between gap-3">
            <div className="text-2xl font-semibold">{todayCount}</div>
            <svg width="160" height="28" viewBox="0 0 160 28" role="img" aria-label="Today sparkline">
              <path d={todayPath} fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600" />
            </svg>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="text-xs text-neutral-500">This week</div>
          <div className="mt-1 text-2xl font-semibold">{weekCount}</div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <div className="mb-2 font-medium">Week overview</div>
        <div className="flex items-end gap-2" aria-label="Weekly totals bar chart">
          {(() => {
            const max = Math.max(1, ...weekDays.map((d) => d.total))
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            return weekDays.map((d, i) => (
              <div key={i} className="flex w-8 flex-col items-center gap-1">
                <div
                  className="w-full rounded-md bg-indigo-600"
                  style={{ height: `${(d.total / max) * 64}px` }}
                  title={`${days[i]}: ${d.total}`}
                />
                <div className="text-[10px] text-neutral-500">{days[i]}</div>
              </div>
            ))
          })()}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <div className="mb-2 font-medium">Last 7 days</div>
        <div className="flex items-end gap-2" aria-label="Last 7 days totals bar chart">
          {(() => {
            const max = Math.max(1, ...last7.map((d) => d.total))
            return last7.map((d, i) => {
              const label = d.date.toLocaleDateString(undefined, { weekday: 'short' })
              return (
                <div key={i} className="flex w-8 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-md bg-indigo-600"
                    style={{ height: `${(d.total / max) * 64}px` }}
                    title={`${label}: ${d.total}`}
                  />
                  <div className="text-[10px] text-neutral-500">{label}</div>
                </div>
              )
            })
          })()}
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
