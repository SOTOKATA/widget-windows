import { ipcRenderer } from 'electron'

export interface SettingsAPI {
  onUpdated: (callback: () => void) => void
  open: () => Promise<void>
  get: () => Promise<unknown>
  save: (settings: unknown) => Promise<void>
}

export const settingsAPI: SettingsAPI = {
  onUpdated: (callback: () => void) => {
    ipcRenderer.on('settings:updated', () => callback())
  },
  open: () => ipcRenderer.invoke('settings:open'),
  get: () => ipcRenderer.invoke('settings:get'),
  save: (settings: unknown) => ipcRenderer.invoke('settings:save', settings)
}
