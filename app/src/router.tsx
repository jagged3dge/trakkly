import { Outlet, Link, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { TrackerList } from './components/TrackerList'
import Insights from './pages/Insights'

// Root layout
export const Root = () => (
  <div className="min-h-screen bg-white text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
    <header className="sticky top-0 z-10 border-b bg-white/80 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
      <h1 className="text-2xl font-semibold tracking-tight">Trakkly</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">Offline-first counters with privacy</p>
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
      </nav>
    </header>
    <main className="p-4">
      <div className="mx-auto max-w-md">
        <Outlet />
      </div>
    </main>
  </div>
)

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

const routeTree = rootRoute.addChildren([indexRoute, insightsRoute])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
