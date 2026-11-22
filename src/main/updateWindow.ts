import { BrowserWindow } from 'electron'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

export function createUpdateWindow(): BrowserWindow {
  const window = new BrowserWindow({
    show: false,
    width: 360,
    height: 130,
    thickFrame: true,
    resizable: false,
    transparent: true,
    frame: false,
    autoHideMenuBar: true,
    title: 'Updater',
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  window.removeMenu()

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    void window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/update`)
  } else {
    void window.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/update' })
  }

  return window
}
