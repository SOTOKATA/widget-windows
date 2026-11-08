import { app } from 'electron'
import { connect } from '@tursodatabase/sync'
import path from 'node:path'

if (!process.env.TODO_TURSO_DATABASE_URL) {
  throw new Error('TODO_TURSO_DATABASE_URL не задана')
}

export const db = connect({
  path: path.join(app.getPath('userData'), 'widget.db'),
  url: () => process.env.TODO_TURSO_DATABASE_URL ?? null,
  authToken: process.env.TODO_TURSO_AUTH_TOKEN,
  clientName: 'desktop-widget'
})
