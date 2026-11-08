// main/database/sync.ts

import { db } from './connection'

let syncing = false

export async function syncTodos(): Promise<boolean> {
  if (syncing) return false

  syncing = true

  try {
    await (await db).push()
    await (await db).pull()

    return true
  } catch (error) {
    console.error('Todo sync failed:', error)
    return false
  } finally {
    syncing = false
  }
}
