import { app, BrowserWindow, ipcMain, screen } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

export interface Settings {
  autoLaunch: boolean
  bgTransparency: number
}

const defaultSettings: Settings = {
  autoLaunch: false,
  bgTransparency: 90
}

const margin = 5

function settingsPath(): string {
  return path.join(app.getPath('userData'), 'settings.json')
}

function isSettings(value: Partial<Settings>): value is Settings {
  return (
    typeof value.autoLaunch === 'boolean' &&
    [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].includes(value.bgTransparency ?? -10)
  )
}

export function getSettings(): Settings {
  try {
    if (fs.existsSync(settingsPath())) {
      const saved = JSON.parse(fs.readFileSync(settingsPath(), 'utf8')) as Partial<Settings>
      if (isSettings(saved)) return saved
    }
  } catch (error) {
    console.error('Unable to read settings:', error)
  }
  return defaultSettings
}

export function applySettings(window: BrowserWindow, settings = getSettings()): void {
  window.webContents.send('settings:updated')
  // const workArea = screen.getPrimaryDisplay().workArea
  // const width = widths[settings.width]
  // const height = settings.height === 'full' ? workArea.height : heights[settings.height]
  // const x = settings.position === 'left' ? workArea.x + margin : workArea.x + workArea.width - width - margin
  // window.setBounds({ x, y: workArea.y + margin, width, height: Math.min(height, workArea.height - margin * 2) })
}

function applyAutoLaunch(enabled: boolean): void {
  if (process.platform === 'win32' || process.platform === 'darwin') {
    app.setLoginItemSettings({ openAtLogin: enabled })
  }
}

export function initializeSettingsHandle(getWidgetWindow: () => BrowserWindow | null): void {
  applyAutoLaunch(getSettings().autoLaunch)

  ipcMain.handle('settings:get', () => getSettings())
  ipcMain.handle('settings:save', (_, candidate: Partial<Settings>) => {
    if (!isSettings(candidate)) return false

    try {
      fs.writeFileSync(settingsPath(), JSON.stringify(candidate, null, 2), 'utf8')
      applyAutoLaunch(candidate.autoLaunch)
      const window = getWidgetWindow()
      if (window && !window.isDestroyed()) applySettings(window, candidate)
      return true
    } catch (error) {
      console.error('Unable to save settings:', error)
      return false
    }
  })
}
