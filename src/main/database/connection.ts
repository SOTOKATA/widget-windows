import { app } from 'electron'
import { connect } from '@tursodatabase/sync'
import path from 'node:path'

export const db = connect({
  path: path.join(app.getPath('userData'), 'widget.db'),
  url: () => process.env.TURSO_DATABASE_URL ?? null,
  authToken: process.env.TURSO_AUTH_TOKEN,
  clientName: 'desktop-widget'
})
