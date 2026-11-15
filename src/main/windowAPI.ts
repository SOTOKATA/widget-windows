import { app, BrowserWindow, screen, Rectangle } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

const file = () => path.join(app.getPath('userData'), 'window-metrics.json')

export function saveWindowMetrics(window: BrowserWindow): void {
  if (window.isDestroyed()) return

  const { x, y, width, height } = window.getNormalBounds()

  try {
    fs.writeFileSync(file(), JSON.stringify({ x, y, width, height }, null, 2), 'utf8')
  } catch (e) {
    console.error('saveWindowMetrics failed', e)
  }
}

export function loadWindowMetrics(): Rectangle | null {
  try {
    const m = JSON.parse(fs.readFileSync(file(), 'utf8')) as Rectangle
    const ok = [m.x, m.y, m.width, m.height].every(Number.isFinite)
    if (!ok) return null

    const visible = screen
      .getAllDisplays()
      .some(
        ({ workArea: a }) =>
          m.x < a.x + a.width && m.x + m.width > a.x && m.y < a.y + a.height && m.y + m.height > a.y
      )
    return visible ? m : null
  } catch (e: any) {
    if (e.code !== 'ENOENT') console.error('loadWindowMetrics failed', e)
    return null
  }
}

export function applyWindowMetrics(window: BrowserWindow): void {
  const m = loadWindowMetrics()
  if (m) window.setBounds(m)
}
