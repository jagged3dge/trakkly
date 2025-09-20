import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
      <header className="sticky top-0 z-10 border-b bg-white/80 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
        <h1 className="text-2xl font-semibold tracking-tight">Trakkly</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Offline-first counters with privacy</p>
      </header>
      <main className="p-4">
        <div className="mx-auto max-w-md">
          <div className="rounded-xl border border-neutral-200 p-4 shadow-sm dark:border-neutral-800">
            <h2 className="mb-2 text-lg font-medium">Welcome</h2>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">Get started by creating your first tracker.</p>
            <button
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900"
            >
              Add Tracker
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
