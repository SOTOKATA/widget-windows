import { ipcRenderer } from 'electron'

export interface WindowAPI {
  saveMetrics: () => void
}

export const windowAPI: WindowAPI = {
  saveMetrics: () => ipcRenderer.invoke('window-api:save-metrics')
}
