import type { Event } from '../db/schema'
import { isSameDay, startOfWeek } from './time'

function toDate(iso: string): Date {
  return new Date(iso)
}

export function eventsForToday(events: Event[], now = new Date()): Event[] {
  return events.filter((e) => isSameDay(toDate(e.createdAt), now))
}

export function isSameWeekLocal(a: Date, b: Date): boolean {
  const sa = startOfWeek(a)
  const sb = startOfWeek(b)
  return isSameDay(sa, sb)
}

export function eventsForThisWeek(events: Event[], now = new Date()): Event[] {
  return events.filter((e) => isSameWeekLocal(toDate(e.createdAt), now))
}

export function sumValue(events: Event[]): number {
  return events.reduce((acc, e) => acc + (e.value || 0), 0)
}

export function totalsByTracker(events: Event[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const e of events) {
    m.set(e.trackerId, (m.get(e.trackerId) || 0) + (e.value || 0))
  }
  return m
}

export type DayTotal = { date: Date; total: number }

export function totalsByDayInWeek(events: Event[], now = new Date()): DayTotal[] {
  const start = startOfWeek(now)
  const days: DayTotal[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    d.setHours(0, 0, 0, 0)
    return { date: d, total: 0 }
  })

  for (const e of eventsForThisWeek(events, now)) {
    const d = toDate(e.createdAt)
    const dayIndex = Math.floor((d.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
    if (dayIndex >= 0 && dayIndex < 7) {
      days[dayIndex].total += e.value || 0
    }
  }
  return days
}
