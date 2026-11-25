import { app, BrowserWindow, ipcMain, shell } from 'electron'
import icon from '../../resources/icon.png?asset'
import { applyWindowMetrics, saveWindowMetrics } from './windowAPI'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import { applySettings } from './settingsHandle'
import { pinToDesktop } from './pin'

export function createMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    minHeight: 500,
    minWidth: 300,
    width: 400,
    height: 900,
    show: false,
    frame: false,
    focusable: false,
    type: 'toolbar',
    transparent: true,
    thickFrame: true,
    resizable: true,
    skipTaskbar: true,
    hasShadow: false,
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  applyWindowMetrics(mainWindow)

  let readyToClose: boolean = false
  mainWindow.on('close', (event) => {
    if (!readyToClose) event.preventDefault()

    saveWindowMetrics(mainWindow)
    mainWindow.webContents.send('window-close')
  })

  ipcMain.on('ready-to-close', () => {
    readyToClose = true
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // For keyboard inputs
  ipcMain.on('widget:focusable', (_, value) => {
    mainWindow.setFocusable(value)
    if (value) mainWindow.focus()
  })

  ipcMain.handle('dev:open-console', () => {
    mainWindow.webContents.openDevTools()
  })

  mainWindow.on('ready-to-show', () => readyToShow(mainWindow))

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL'])
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  else mainWindow.loadFile(join(__dirname, '../renderer/index.html'))

  return mainWindow
}

function readyToShow(window: BrowserWindow): void {
  applySettings(window)
  window.showInactive()
  pinToDesktop(window)
}
