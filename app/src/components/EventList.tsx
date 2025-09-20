import { useEffect, useState } from 'react'
import { db } from '../db/db'
import type { Event } from '../db/schema'

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

export function EventList({ trackerId }: { trackerId: string }) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const rows = await db.events.where('trackerId').equals(trackerId).toArray()
    rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    setEvents(rows)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // no live query yet; can add Dexie live-query or reload upon actions
  }, [trackerId])

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>
  if (events.length === 0) return <p className="text-sm text-neutral-500">No events yet.</p>

  return (
    <ul className="mt-2 space-y-2">
      {events.map((e) => (
        <li key={e.id} className="rounded-lg border border-neutral-200 p-2 text-sm dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="font-mono">
              {e.type === 'increment' ? '+' : ''}
              {e.value}
            </div>
            <div className="text-neutral-500">{formatDate(e.createdAt)}</div>
          </div>
          {e.reason && <div className="mt-1 text-neutral-600 dark:text-neutral-400">{e.reason}</div>}
        </li>
      ))}
    </ul>
  )
}
