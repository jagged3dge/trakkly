export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function toISODate(d: Date): string {
  const sd = startOfDay(d)
  return sd.toISOString()
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function startOfWeek(d: Date): Date {
  // Week starts on Monday
  const day = d.getDay() || 7 // 1..7 (Mon..Sun)
  const diff = day - 1
  const res = new Date(d)
  res.setHours(0, 0, 0, 0)
  res.setDate(res.getDate() - diff)
  return res
}

export function isSameWeek(a: Date, b: Date): boolean {
  const sa = startOfWeek(a)
  const sb = startOfWeek(b)
  return isSameDay(sa, sb)
}
