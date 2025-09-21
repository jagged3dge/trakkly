import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TrackerList } from './TrackerList'
import { AdaptersProvider } from '../providers/AdaptersProvider'
import { resetDb } from '../test/resetDb'
import { useTrakkly } from '../state/store'
import { db } from '../db/db'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <AdaptersProvider>{children}</AdaptersProvider>
}

async function createTracker(name: string, tags: string[] = []) {
  return await useTrakkly.getState().createTracker({
    name,
    color: '#4f46e5',
    icon: 'hash',
    tags,
    stepSize: 1,
    pinned: false,
  })
}

describe('TrackerList', () => {
  beforeEach(async () => {
    await resetDb()
    useTrakkly.setState({ trackers: [], loading: false })
  })

  it('pin toggle updates button label and persists', async () => {
    const t = await createTracker('Hydrate')
    render(
      <Wrapper>
        <TrackerList />
      </Wrapper>,
    )

    // Wait for tracker to appear
    const item = await screen.findByText('Hydrate')
    const card = item.closest('li') as HTMLElement
    const pinBtn = within(card).getByRole('button', { name: /pin tracker/i })
    await userEvent.click(pinBtn)

    // Button should now be Unpin (wait for state update)
    await within(card).findByRole('button', { name: /unpin tracker/i })

    // Persisted
    const persisted = await db.trackers.get(t.id)
    expect(persisted?.pinned).toBe(true)
  })

  it('tag filter shows only trackers with selected tag', async () => {
    await createTracker('Hydrate', ['health'])
    await createTracker('Push Ups', ['gym'])
    render(
      <Wrapper>
        <TrackerList />
      </Wrapper>,
    )

    // Select tag "gym"
    const select = await screen.findByLabelText(/tag/i)
    await userEvent.selectOptions(select, 'gym')

    expect(screen.queryByText('Hydrate')).not.toBeInTheDocument()
    expect(screen.getByText('Push Ups')).toBeInTheDocument()
  })
})
