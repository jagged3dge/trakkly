const KEY = 'trakkly_device_id'

export function getDeviceId(): string {
  try {
    const existing = localStorage.getItem(KEY)
    if (existing) return existing
    const id = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`
    localStorage.setItem(KEY, id)
    return id
  } catch {
    // Fallback if storage is unavailable
    return 'device-local'
  }
}
