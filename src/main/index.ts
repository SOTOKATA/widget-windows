import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Tray, Menu, nativeImage } from 'electron'
import { initializeTursoDatabase } from './database/ipc'
import { initializeSettingsWindow, openSettingsWindow } from './settingsWindow'
import { applySettings, initializeSettingsHandle } from './settingsHandle'
import { pinToDesktop } from './pin'
import { initializeTodoModalWindow } from './todoModalWindow'
import './LocalTodoAPI'
import { applyWindowMetrics, saveWindowMetrics } from './windowAPI'
import { setupAutoUpdater } from './updater'

let mainWindow: BrowserWindow | null = null

function createWindow(): BrowserWindow {
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

function createTray(window: BrowserWindow): Tray {
  const icon = nativeImage.createFromPath(join(__dirname, '../../resources/icon.png'))
  const tray = new Tray(icon)

  tray.setToolTip('Todo Widget')

  const menu = Menu.buildFromTemplate([
    { label: 'Show', click: () => window.show() },
    { label: 'Hide', click: () => window.hide() },
    { label: 'Settings', click: () => openSettingsWindow() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ])
  tray.setContextMenu(menu)

  tray.on('click', () => window.show())

  return tray
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  await initializeTursoDatabase()
  // Set app user model id for Windows integration, including startup registration.
  electronApp.setAppUserModelId('com.electron')
  initializeSettingsWindow()
  initializeTodoModalWindow()
  initializeSettingsHandle(() => mainWindow)

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  await setupAutoUpdater()


  mainWindow = createWindow()
  createTray(mainWindow)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) mainWindow = createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
