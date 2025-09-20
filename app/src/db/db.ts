import Dexie, { type Table } from 'dexie'
import type { Tracker, Event, UserPreferences } from './schema'

export class TrakklyDB extends Dexie {
  trackers!: Table<Tracker, string>
  events!: Table<Event, string>
  preferences!: Table<UserPreferences, string>

  constructor() {
    super('trakkly')

    this.version(1).stores({
      // indexes: primary key + indexes for common queries
      trackers: 'id, name, pinned, updatedAt',
      events: 'id, trackerId, createdAt',
      preferences: 'id',
    })
  }
}

export const db = new TrakklyDB()
