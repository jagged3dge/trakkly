import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '../db/db'
import { useTrakkly } from './store'
import { resetDb } from '../test/resetDb'

async function createSampleTracker() {
  const t = await useTrakkly.getState().createTracker({
    name: '  Water  ',
    color: '#4f46e5',
    icon: 'drop',
    tags: ['health'],
    // stepSize optional; defaults to 1
    stepSize: 1,
    pinned: false,
  })
  return t
}

describe('store actions', () => {
  beforeEach(async () => {
    await resetDb()
    useTrakkly.setState({ trackers: [], loading: false })
  })

  it('createTracker trims name, sets defaults, and persists', async () => {
    const tracker = await createSampleTracker()
    const persisted = await db.trackers.get(tracker.id)
    expect(persisted).toBeTruthy()
    expect(persisted!.name).toBe('Water')
    expect(persisted!.stepSize).toBe(1)
    expect(persisted!.pinned).toBe(false)
    expect(persisted!.createdAt).toBeTruthy()
    expect(persisted!.updatedAt).toBeTruthy()
  })

  it('increment writes an increment event and updates updatedAt', async () => {
    const tracker = await createSampleTracker()
    const before = tracker.updatedAt
    await useTrakkly.getState().increment(tracker.id)

    const events = await db.events.where('trackerId').equals(tracker.id).toArray()
    expect(events.length).toBe(1)
    expect(events[0].type).toBe('increment')
    expect(events[0].value).toBe(1)

    const updated = await db.trackers.get(tracker.id)
    expect(updated!.updatedAt >= before).toBe(true)
  })

  it('adjust writes an adjustment event with delta and reason', async () => {
    const tracker = await createSampleTracker()
    await useTrakkly.getState().adjust(tracker.id, -2, 'fix')

    const events = await db.events.where('trackerId').equals(tracker.id).toArray()
    expect(events.length).toBe(1)
    expect(events[0].type).toBe('adjustment')
    expect(events[0].value).toBe(-2)
    expect(events[0].reason).toBe('fix')
  })

  it('togglePin toggles pinned state and persists', async () => {
    const tracker = await createSampleTracker()
    let persisted = await db.trackers.get(tracker.id)
    expect(persisted!.pinned).toBe(false)

    await useTrakkly.getState().togglePin(tracker.id)
    persisted = await db.trackers.get(tracker.id)
    expect(persisted!.pinned).toBe(true)

    await useTrakkly.getState().togglePin(tracker.id, false)
    persisted = await db.trackers.get(tracker.id)
    expect(persisted!.pinned).toBe(false)
  })
})
