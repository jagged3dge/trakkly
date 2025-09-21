import Dexie from 'dexie'
import { db } from '../db/db'

export async function resetDb() {
  try {
    await db.close()
    await Dexie.delete('trakkly')
  } catch {
    // ignore
  }
  await db.open()
}
