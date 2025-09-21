import { describe, it, expect } from 'vitest'
import { startOfDay, isSameDay, startOfWeek, isSameWeek } from './time'

describe('time utils', () => {
  it('startOfDay normalizes to midnight', () => {
    const d = new Date(2025, 8, 20, 15, 34, 0) // local time: Sep 20, 2025 15:34
    const s = startOfDay(d)
    expect(s.getHours()).toBe(0)
    expect(s.getMinutes()).toBe(0)
  })

  it('isSameDay detects same calendar day', () => {
    const a = new Date(2025, 8, 20, 1, 0, 0)
    const b = new Date(2025, 8, 20, 23, 59, 59)
    expect(isSameDay(a, b)).toBe(true)
  })

  it('startOfWeek returns Monday start', () => {
    const wed = new Date(2025, 8, 17, 10, 0, 0) // local Wednesday
    const wstart = startOfWeek(wed)
    // Monday of that ISO week is 2025-09-15 (local)
    expect(wstart.getDate()).toBe(15)
  })

  it('isSameWeek compares ISO weeks (Mon-Sun)', () => {
    const a = new Date(2025, 8, 15, 0, 0, 0) // local Monday
    const b = new Date(2025, 8, 21, 23, 59, 59) // local Sunday same week
    expect(isSameWeek(a, b)).toBe(true)
  })
})
