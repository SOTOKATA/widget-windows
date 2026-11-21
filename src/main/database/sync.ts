import { dbPromise } from './connection'

let syncing = false

export async function syncDatabase(): Promise<boolean> {
  if (syncing) return false

  syncing = true

  try {
    const db = await dbPromise
    await db.push()
    await db.pull()

    return true
  } catch (error) {
    console.error('Database sync failed:', error)
    return false
  } finally {
    syncing = false
  }
}
