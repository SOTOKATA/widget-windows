import { ipcRenderer } from 'electron'

export interface WindowAPI {
  onWindowClose: (callback: () => void) => void
  readyToClose: () => void
}

export const windowAPI: WindowAPI = {
  onWindowClose: (callback) => {
    ipcRenderer.on('window-close', () => callback());
  },
  readyToClose: () => {
    ipcRenderer.send('ready-to-close')
  }
}
