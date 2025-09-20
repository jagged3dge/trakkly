import './App.css'
import { TrackerList } from './components/TrackerList'

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
      <header className="sticky top-0 z-10 border-b bg-white/80 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
        <h1 className="text-2xl font-semibold tracking-tight">Trakkly</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Offline-first counters with privacy</p>
      </header>
      <main className="p-4">
        <div className="mx-auto max-w-md">
          <TrackerList />
        </div>
      </main>
    </div>
  )
}

export default App
