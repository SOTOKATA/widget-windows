import { app, BrowserWindow } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import { createUpdateWindow } from './updateWindow'

autoUpdater.logger = log
log.transports.file.level = 'info'
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = false
autoUpdater.allowDowngrade = false

export async function setupAutoUpdater(): Promise<void> {
  if (!app.isPackaged) {
    return Promise.resolve()
  }

  const updateWindow = createUpdateWindow()
  await new Promise<void>((resolve) =>
    updateWindow.webContents.once('did-finish-load', () => resolve())
  )

  return new Promise((resolve) => {
    let settled = false
    let updateAvailable = false
    const finish = (status: 'ready' | 'error'): void => {
      if (settled) return
      settled = true
      updateWindow.webContents.send('update:state', { status })
      if (!updateWindow.isDestroyed()) updateWindow.close()
      resolve()
    }

    autoUpdater.on('checking-for-update', () => {
      log.info('Checking for update...')
      updateWindow.webContents.send('update:state', { status: 'checking' })
    })
    autoUpdater.on('update-available', (info) => {
      updateAvailable = true
      log.info(`Available version: ${info.version}`)
      updateWindow.webContents.send('update:state', { status: 'downloading' })
      updateWindow.show()
    })
    autoUpdater.on('update-not-available', () => {
      log.info('Update does not exist')
      finish('ready')
    })
    autoUpdater.on('download-progress', (progress) => {
      log.info(`Downloading: ${progress.percent.toFixed(1)}%`)
      updateWindow.webContents.send('update:progress', progress.percent)
    })
    autoUpdater.on('update-downloaded', (info) => {
      log.info(`Version ${info.version} downloaded`)
      updateWindow.webContents.send('update:state', { status: 'installing' })
      autoUpdater.quitAndInstall(true, true)
    })
    autoUpdater.on('error', (error) => {
      log.error('Error updating:', error)
      finish('error')
    })

    void autoUpdater.checkForUpdates().then((result) => {
      // A missing/disabled update feed can return without emitting update-not-available.
      if (!result && !updateAvailable) finish('ready')
    }).catch((error: unknown) => {
      log.error('Error checking updates:', error)
      finish('error')
    })
  })
}
