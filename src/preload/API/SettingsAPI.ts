import { ipcRenderer } from 'electron'
import { Settings } from '@app-types/Settings'

export interface SettingsAPI {
  onUpdated: (callback: () => void) => void
  open: () => Promise<void>
  get: () => Promise<Settings>
  save: (settings: Settings) => Promise<boolean>
}

export const settingsAPI: SettingsAPI = {
  onUpdated: (callback: () => void) => {
    ipcRenderer.on('settings:updated', () => callback())
  },
  open: () => ipcRenderer.invoke('settings:open'),
  get: () => ipcRenderer.invoke('settings:get'),
  save: (settings) => ipcRenderer.invoke('settings:save', settings)
}
