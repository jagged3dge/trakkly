import { describe, it, expect } from 'vitest'
import { eventsForThisWeek, eventsForToday, sumValue, totalsByDayInWeek, totalsByTracker } from './insights'
import type { Event } from '../db/schema'

function iso(year: number, monthIndex: number, day: number, h = 0, m = 0, s = 0) {
  return new Date(year, monthIndex, day, h, m, s).toISOString()
}

describe('insights utilities', () => {
  const now = new Date(2025, 8, 18) // 2025-09-18 (Thu)
  const events: Event[] = [
    { id: 'e1', trackerId: 't1', type: 'increment', value: 1, createdAt: iso(2025, 8, 18, 9), deviceId: 'd' }, // Thu
    { id: 'e2', trackerId: 't1', type: 'increment', value: 2, createdAt: iso(2025, 8, 18, 10), deviceId: 'd' }, // Thu
    { id: 'e3', trackerId: 't2', type: 'adjustment', value: -1, createdAt: iso(2025, 8, 17), deviceId: 'd' }, // Wed
    { id: 'e4', trackerId: 't2', type: 'increment', value: 3, createdAt: iso(2025, 8, 15), deviceId: 'd' }, // Mon
    { id: 'e5', trackerId: 't1', type: 'increment', value: 5, createdAt: iso(2025, 8, 22), deviceId: 'd' }, // Mon next week
  ]

  it('eventsForToday returns only events from today', () => {
    const today = eventsForToday(events, now)
    expect(today.map((e) => e.id)).toEqual(['e1', 'e2'])
  })

  it('eventsForThisWeek returns events within same ISO week', () => {
    const week = eventsForThisWeek(events, now)
    // Should include Mon(15), Wed(17), Thu(18) but not next Monday(22)
    expect(week.map((e) => e.id).sort()).toEqual(['e1', 'e2', 'e3', 'e4'].sort())
  })

  it('totalsByTracker sums values per tracker', () => {
    const week = eventsForThisWeek(events, now)
    const map = totalsByTracker(week)
    expect(map.get('t1')).toBe(1 + 2)
    expect(map.get('t2')).toBe(-1 + 3)
  })

  it('sumValue sums event values', () => {
    const week = eventsForThisWeek(events, now)
    expect(sumValue(week)).toBe(1 + 2 + (-1) + 3)
  })

  it('totalsByDayInWeek produces 7 bins starting Monday', () => {
    const days = totalsByDayInWeek(events, now)
    expect(days).toHaveLength(7)
    // Mon index 0, Wed index 2, Thu index 3 (relative to Monday start)
    expect(days[0].total).toBe(3) // e4
    expect(days[2].total).toBe(-1) // e3
    expect(days[3].total).toBe(1 + 2) // e1 + e2
    // Next Monday (e5) should not be included
    expect(days[6].total).toBe(0)
  })
})
