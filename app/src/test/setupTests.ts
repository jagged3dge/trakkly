import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { webcrypto as nodeCrypto } from 'crypto'

// Automatically unmount and cleanup DOM after the test is finished.
afterEach(() => {
  cleanup()
})

// Ensure WebCrypto is available in tests (Node 20 provides crypto.webcrypto)
if (!globalThis.crypto || !(globalThis.crypto as any).subtle) {
  ;(globalThis as any).crypto = nodeCrypto as any
}
