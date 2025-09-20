import { create } from 'zustand'
import { db } from '../db/db'
import type { Tracker, Event } from '../db/schema'
import { uuid } from '../lib/id'

export type TrakklyState = {
  trackers: Tracker[]
  loading: boolean
  init: () => Promise<void>
  createTracker: (input: Pick<Tracker, 'name' | 'color' | 'icon' | 'tags' | 'stepSize' | 'pinned'>) => Promise<Tracker>
  increment: (trackerId: string) => Promise<void>
  adjust: (trackerId: string, delta: number, reason?: string) => Promise<void>
  listTrackers: () => Promise<Tracker[]>
}

function nowIso() { return new Date().toISOString() }
const DEVICE_ID = 'device-local' // TODO: replace with persistent device id

export const useTrakkly = create<TrakklyState>((set, _get) => ({
  trackers: [],
  loading: false,

  init: async () => {
    set({ loading: true })
    const trackers = await db.trackers.toArray()
    set({ trackers, loading: false })
  },

  listTrackers: async () => {
    const trackers = await db.trackers.toArray()
    set({ trackers })
    return trackers
  },

  createTracker: async (input) => {
    const tracker: Tracker = {
      id: uuid(),
      name: input.name.trim(),
      color: input.color,
      icon: input.icon,
      tags: input.tags ?? [],
      stepSize: input.stepSize ?? 1,
      pinned: !!input.pinned,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }
    await db.trackers.add(tracker)
    const trackers = await db.trackers.toArray()
    set({ trackers })
    return tracker
  },

  increment: async (trackerId) => {
    const tracker = await db.trackers.get(trackerId)
    if (!tracker) return
    const ev: Event = {
      id: uuid(),
      trackerId: tracker.id,
      type: 'increment',
      value: tracker.stepSize || 1,
      createdAt: nowIso(),
      deviceId: DEVICE_ID,
    }
    await db.events.add(ev)
    tracker.updatedAt = nowIso()
    await db.trackers.put(tracker)
    const trackers = await db.trackers.toArray()
    set({ trackers })
  },

  adjust: async (trackerId, delta, reason) => {
    const tracker = await db.trackers.get(trackerId)
    if (!tracker) return
    const ev: Event = {
      id: uuid(),
      trackerId: tracker.id,
      type: 'adjustment',
      value: delta,
      reason,
      createdAt: nowIso(),
      deviceId: DEVICE_ID,
    }
    await db.events.add(ev)
    tracker.updatedAt = nowIso()
    await db.trackers.put(tracker)
    const trackers = await db.trackers.toArray()
    set({ trackers })
  },
}))
