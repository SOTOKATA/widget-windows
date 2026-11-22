import { app, BrowserWindow, ipcMain } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import { createSettings, Settings } from '@app-types/Settings'

const defaultSettings: Settings = createSettings()

function settingsPath(): string {
  return path.join(app.getPath('userData'), 'settings.json')
}

function isSettings(value: Partial<Settings>): value is Settings {
  return (
    typeof value.autoLaunch === 'boolean' &&
    [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].includes(value.bgTransparency ?? -10) &&
    value.markdownSettings != undefined &&
    value.removeBorder != undefined &&
    value.gridWidth != undefined &&
    value.gridHeight != undefined
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

export function applySettings(window: BrowserWindow): void {
  window.webContents.send('settings:updated')
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
      if (window && !window.isDestroyed()) applySettings(window)
      return true
    } catch (error) {
      console.error('Unable to save settings:', error)
      return false
    }
  })
}
