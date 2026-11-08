import { BrowserWindow, ipcMain } from 'electron'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'

let settingsWindow: BrowserWindow | null = null

export function openSettingsWindow(): void {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus()
    return
  }

  settingsWindow = new BrowserWindow({
    width: 360,
    height: 350,
    resizable: false,
    title: 'Todo Widget Settings',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  settingsWindow.removeMenu()

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    void settingsWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/settings`)
  } else {
    void settingsWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/settings' })
  }

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })
}

export function initializeSettingsWindow(): void {
  ipcMain.handle('settings:open', () => openSettingsWindow())
}
