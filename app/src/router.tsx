import { useEffect } from 'react'
import { Outlet, Link, createRootRoute, createRoute, createRouter, useNavigate, useRouterState } from '@tanstack/react-router'
import { TrackerList } from './components/TrackerList'
import Insights from './pages/Insights'
import Preferences from './pages/Preferences'
import Lock from './pages/Lock'
import { useAdapters } from './providers/AdaptersProvider'
import { usePrefs } from './state/prefs'
import { useInstallPrompt } from './hooks/useInstallPrompt'

// Root layout
export const Root = () => {
  const { crypto } = useAdapters()
  const navigate = useNavigate()
  const { location } = useRouterState()
  const { prefs, loaded, load } = usePrefs()
  const { canInstall, promptInstall } = useInstallPrompt()
  // Lighthouse profiling bypass: skip lock guard if VITE_DISABLE_LOCK=1 or ?unlock=1
  const disableLock = (import.meta as any).env?.VITE_DISABLE_LOCK === '1' ||
    (() => {
      try {
        const s = new URLSearchParams(location.search || '')
        return s.get('unlock') === '1'
      } catch {
        return false
      }
    })()
  function handleLock() {
    if (disableLock) return
    crypto.lock()
    navigate({ to: '/lock' })
  }
  // Ensure preferences are loaded for auto-lock
  useEffect(() => {
    if (!loaded) void load()
  }, [loaded, load])

  // Redirect to /lock when locked and accessing protected routes
  useEffect(() => {
    if (disableLock) return
    const path = location.pathname
    const isProtected = path !== '/lock'
    if (isProtected && !crypto.isUnlocked()) {
      navigate({ to: '/lock' })
    }
  }, [crypto, location.pathname, navigate, disableLock])

  // Auto-lock on inactivity based on preferences
  useEffect(() => {
    if (!loaded || disableLock) return
    let timer: number | undefined
    const reset = () => {
      if (!prefs.autoLockMinutes || prefs.autoLockMinutes <= 0) return
      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        crypto.lock()
        navigate({ to: '/lock' })
      }, prefs.autoLockMinutes * 60 * 1000)
    }
    const events: Array<keyof WindowEventMap> = ['click', 'keydown', 'touchstart', 'mousemove']
    events.forEach((ev) => window.addEventListener(ev, reset, { passive: true } as any))
    reset()
    return () => {
      if (timer) window.clearTimeout(timer)
      events.forEach((ev) => window.removeEventListener(ev, reset as any))
    }
  }, [prefs.autoLockMinutes, loaded, crypto, navigate, disableLock])
  return (
  <div className="min-h-screen bg-white text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
    <header className="sticky top-0 z-10 border-b bg-white/80 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trakkly</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Offline-first counters with privacy</p>
        </div>
        <div className="flex items-center gap-2">
          {canInstall && (
            <button onClick={() => void promptInstall()} className="rounded-lg border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Install</button>
          )}
          <button onClick={handleLock} className="rounded-lg border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800" aria-disabled={disableLock} title={disableLock ? 'Lock disabled by profiling' : 'Lock'}>
            Lock
          </button>
        </div>
      </div>
      <nav className="mt-2 flex gap-2 text-sm">
        <Link
          to="/"
          activeProps={{ className: 'bg-indigo-600 text-white' }}
          className="rounded-lg border border-neutral-300 px-3 py-1 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Trackers
        </Link>
        <Link
          to="/insights"
          activeProps={{ className: 'bg-indigo-600 text-white' }}
          className="rounded-lg border border-neutral-300 px-3 py-1 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Insights
        </Link>
        <Link
          to="/prefs"
          activeProps={{ className: 'bg-indigo-600 text-white' }}
          className="rounded-lg border border-neutral-300 px-3 py-1 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Preferences
        </Link>
      </nav>
    </header>
    <main className="p-4">
      <div className="mx-auto max-w-md">
        <Outlet />
      </div>
    </main>
  </div>
)}

const NotFound = () => (
  <div className="rounded-xl border border-neutral-200 p-4 text-sm dark:border-neutral-800">
    <div className="font-medium">Page not found</div>
    <p className="text-neutral-500">The page you requested does not exist.</p>
  </div>
)

const rootRoute = createRootRoute({
  component: Root,
  notFoundComponent: NotFound,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: TrackerList,
})

const insightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/insights',
  component: Insights,
})

const prefsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/prefs',
  component: Preferences,
})

const lockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lock',
  component: Lock,
})

const routeTree = rootRoute.addChildren([indexRoute, insightsRoute, prefsRoute, lockRoute])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
