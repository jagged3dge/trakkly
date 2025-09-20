import { useState } from 'react'
import type { Tracker } from '../db/schema'
import { Modal } from './Modal'
import { useTrakkly } from '../state/store'

export function AddTrackerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { createTracker } = useTrakkly()
  const [name, setName] = useState('')
  const [color, setColor] = useState('#4f46e5')
  const [icon, setIcon] = useState('hash')
  const [tags, setTags] = useState('')
  const [stepSize, setStepSize] = useState<number>(1)
  const [pinned, setPinned] = useState(false)
  const [saving, setSaving] = useState(false)

  function reset() {
    setName('')
    setColor('#4f46e5')
    setIcon('hash')
    setTags('')
    setStepSize(1)
    setPinned(false)
  }

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    try {
      const input: Pick<Tracker, 'name' | 'color' | 'icon' | 'tags' | 'stepSize' | 'pinned'> = {
        name: name.trim(),
        color,
        icon,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        stepSize: Math.max(1, Math.floor(Number(stepSize) || 1)),
        pinned,
      }
      await createTracker(input)
      reset()
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Tracker">
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
            placeholder="Water, Push-ups, ..."
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm mb-1">Step size</label>
            <input
              type="number"
              min={1}
              value={stepSize}
              onChange={(e) => setStepSize(parseInt(e.target.value || '1', 10))}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-full rounded-lg border border-neutral-300 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Icon (name)</label>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
            placeholder="hash, bolt, heart, ..."
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Tags (comma separated)</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
            placeholder="health, gym"
          />
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
          <span className="text-sm">Pin to top</span>
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
