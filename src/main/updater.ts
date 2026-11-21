import { app } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

autoUpdater.logger = log
log.transports.file.level = 'info'

autoUpdater.autoDownload = true

autoUpdater.autoInstallOnAppQuit = false

autoUpdater.allowDowngrade = false

let isChecking = false
let isInstalling = false

async function checkForUpdates(): Promise<void> {
  if (!app.isPackaged || isChecking || isInstalling) {
    return
  }

  isChecking = true

  try {
    await autoUpdater.checkForUpdates()
  } catch (error) {
    log.error('Error check updates:', error)
  } finally {
    isChecking = false
  }
}

export function setupAutoUpdater(): void {
  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...')
  })

  autoUpdater.on('update-available', (info) => {
    log.info(`Available version: ${info.version}`)
  })

  autoUpdater.on('update-not-available', () => {
    log.info('Update is not exists')
  })

  autoUpdater.on('download-progress', (progress) => {
    log.info(`Downloading: ${progress.percent.toFixed(1)}%`)
  })

  autoUpdater.on('update-downloaded', (info) => {
    log.info(`Version ${info.version} downloaded`)

    if (isInstalling) return

    isInstalling = true

    autoUpdater.quitAndInstall(true, true)
  })

  autoUpdater.on('error', (error) => {
    log.error('Error update:', error)
  })

  void checkForUpdates()

  const interval = setInterval(
    () => {
      void checkForUpdates()
    },
    30 * 60 * 1000
  )

  interval.unref()
}
