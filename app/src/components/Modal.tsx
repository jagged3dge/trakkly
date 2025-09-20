import { useEffect } from 'react'

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white dark:bg-neutral-900 p-4 shadow-lg">
        {title && <h3 className="mb-3 text-lg font-medium">{title}</h3>}
        {children}
      </div>
    </div>
  )
}
