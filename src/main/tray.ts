import { app, BrowserWindow, Menu, nativeImage, Tray } from 'electron'
import { join } from 'path'
import { openSettingsWindow } from './settingsWindow'

export function createTray(window: BrowserWindow): Tray {
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
