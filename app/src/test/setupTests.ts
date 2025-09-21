import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Automatically unmount and cleanup DOM after the test is finished.
afterEach(() => {
  cleanup()
})
