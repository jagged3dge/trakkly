import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddTrackerModal } from './AddTrackerModal'
import { AdaptersProvider } from '../providers/AdaptersProvider'
import { resetDb } from '../test/resetDb'
import { db } from '../db/db'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <AdaptersProvider>{children}</AdaptersProvider>
}

describe('AddTrackerModal', () => {
  beforeEach(async () => {
    await resetDb()
  })

  it('creates a tracker when valid name is provided', async () => {
    const onClose = vi.fn()
    render(
      <Wrapper>
        <AddTrackerModal open={true} onClose={onClose} />
      </Wrapper>,
    )

    const name = screen.getByLabelText(/name/i)
    await userEvent.type(name, 'Hydrate')

    const save = screen.getByRole('button', { name: /save/i })
    await userEvent.click(save)

    // DB should contain the tracker
    const trackers = await db.trackers.where('name').equals('Hydrate').toArray()
    expect(trackers.length).toBe(1)
    expect(onClose).toHaveBeenCalled()
  })

  it('prevents save when name is empty', async () => {
    const onClose = vi.fn()
    render(
      <Wrapper>
        <AddTrackerModal open={true} onClose={onClose} />
      </Wrapper>,
    )

    const save = screen.getByRole('button', { name: /save/i })
    expect(save).toBeDisabled()
  })
})
