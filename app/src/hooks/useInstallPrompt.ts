import { useEffect, useState, useCallback } from 'react'

// TypeScript does not include BeforeInstallPromptEvent in standard DOM typings.
// Define the minimal interface needed for this hook.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    function onBeforeInstallPrompt(e: BeforeInstallPromptEvent) {
      e.preventDefault()
      setDeferred(e)
    }
    function onAppInstalled() {
      setInstalled(true)
      setDeferred(null)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)

    // initial installed detection
    const standalone = window.matchMedia?.('(display-mode: standalone)').matches || (navigator as any).standalone
    if (standalone) setInstalled(true)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [])

  const canInstall = !!deferred && !installed

  const promptInstall = useCallback(async () => {
    if (!deferred) return false
    deferred.prompt()
    const choice = await deferred.userChoice
    setDeferred(null)
    return choice?.outcome === 'accepted'
  }, [deferred])

  return { canInstall, installed, promptInstall }
}
