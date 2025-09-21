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

// --- Minimal sparkline helpers ---

// Returns 24 bins (per hour) totals for today
export function binsForToday(events: Event[], now = new Date()): number[] {
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  const bins = new Array(24).fill(0)
  for (const e of eventsForToday(events, now)) {
    const d = toDate(e.createdAt)
    const h = d.getHours()
    if (h >= 0 && h < 24) bins[h] += e.value || 0
  }
  return bins
}

// Build a simple path string for an inline SVG sparkline
export function sparklinePath(bins: number[], width = 160, height = 28, padding = 2): string {
  const n = bins.length
  if (n <= 1) return ''
  const max = Math.max(0, ...bins)
  const innerH = Math.max(1, height - padding * 2)
  const stepX = n > 1 ? (width - padding * 2) / (n - 1) : 0
  const points: Array<[number, number]> = bins.map((v, i) => {
    const yRatio = max === 0 ? 0 : v / max
    const x = padding + i * stepX
    const y = padding + (innerH - yRatio * innerH)
    return [x, y]
  })
  const [x0, y0] = points[0]
  return 'M ' + x0 + ' ' + y0 + points.slice(1).map(([x, y]) => ` L ${x} ${y}`).join('')
}

// --- Daily bars over a sliding window ---

export function totalsByLastNDays(events: Event[], n: number, now = new Date()): DayTotal[] {
  const end = new Date(now)
  end.setHours(0, 0, 0, 0)
  const start = new Date(end)
  start.setDate(end.getDate() - (n - 1))
  const days: DayTotal[] = Array.from({ length: n }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    d.setHours(0, 0, 0, 0)
    return { date: d, total: 0 }
  })
  for (const e of events) {
    const d = toDate(e.createdAt)
    const dd = new Date(d)
    dd.setHours(0, 0, 0, 0)
    if (dd < start || dd > end) continue
    const idx = Math.floor((dd.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
    if (idx >= 0 && idx < n) days[idx].total += e.value || 0
  }
  return days
}
