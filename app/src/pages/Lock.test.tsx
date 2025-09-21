import { describe, it, expect, beforeEach, vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Lock from './Lock'
import { AdaptersProvider } from '../providers/AdaptersProvider'
import { resetDb } from '../test/resetDb'
import { WebCryptoEngine } from '../adapters/crypto'

// Mock navigate to avoid wiring a full router
const navigateMock = vi.fn()
vi.mock('@tanstack/react-router', async (orig) => {
  const actual = await orig()
  return {
    ...actual as object,
    useNavigate: () => navigateMock,
  }
})

function Wrapper({ children }: { children: React.ReactNode }) {
  return <AdaptersProvider>{children}</AdaptersProvider>
}

describe('Lock screen', () => {
  beforeEach(async () => {
    await resetDb()
    navigateMock.mockReset()
  })

  it('unlocks with correct passcode and navigates home', async () => {
    // Prime DB with wrapped key using passcode 'secret'
    const engine = new WebCryptoEngine()
    await engine.unlockWithPasscode!('secret')
    engine.lock()

    render(
      <Wrapper>
        <Lock />
      </Wrapper>
    )

    const input = screen.getByLabelText(/passcode/i)
    await userEvent.type(input, 'secret')
    const btn = screen.getByRole('button', { name: /unlock/i })
    await userEvent.click(btn)

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith({ to: '/' }))
  })

  it('shows error on wrong passcode and stays on page', async () => {
    const engine = new WebCryptoEngine()
    await engine.unlockWithPasscode!('right-pass')
    engine.lock()

    render(
      <Wrapper>
        <Lock />
      </Wrapper>
    )

    const input = screen.getByLabelText(/passcode/i)
    await userEvent.type(input, 'wrong-pass')
    const btn = screen.getByRole('button', { name: /unlock/i })
    await userEvent.click(btn)

    expect(await screen.findByRole('alert')).toHaveTextContent(/incorrect passcode/i)
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
