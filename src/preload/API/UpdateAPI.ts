import { ipcRenderer } from 'electron'

export type UpdateState = 'checking' | 'downloading' | 'installing' | 'ready' | 'error'

export interface UpdateAPI {
  onDownloadStateUpdate: (callback: (progress: number) => void) => () => void
  onStateUpdate: (callback: (state: UpdateState) => void) => () => void
}

export const updateAPI: UpdateAPI = {
  onDownloadStateUpdate: (callback) => {
    const listener = (_event: Electron.IpcRendererEvent, progress: number): void => callback(progress)
    ipcRenderer.on('update:progress', listener)
    return () => ipcRenderer.removeListener('update:progress', listener)
  },
  onStateUpdate: (callback) => {
    const listener = (_event: Electron.IpcRendererEvent, payload: { status: UpdateState }): void => callback(payload.status)
    ipcRenderer.on('update:state', listener)
    return () => ipcRenderer.removeListener('update:state', listener)
  }
}
