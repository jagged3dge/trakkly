import { useEffect, useState } from 'react'
import { Modal } from './Modal'
import { useTrakkly } from '../state/store'

export function AdjustModal({ open, onClose, trackerId }: { open: boolean; onClose: () => void; trackerId: string }) {
  const { adjust } = useTrakkly()
  const [delta, setDelta] = useState<string>('0')
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setDelta('0')
      setReason('')
    }
  }, [open])

  async function onSave() {
    const n = Number(delta)
    if (!Number.isFinite(n) || n === 0) return
    setSaving(true)
    try {
      await adjust(trackerId, Math.trunc(n), reason.trim() || undefined)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Adjustment">
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm">Delta (±)</label>
            <input
              type="number"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
              placeholder="e.g. -1 or 3"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm">Reason (optional)</label>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
            placeholder="Fix mistake..."
          />
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving || Number(delta) === 0}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Apply'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
