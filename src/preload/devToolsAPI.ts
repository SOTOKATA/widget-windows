import { ipcRenderer } from 'electron'

export interface DevToolsAPI {
  openConsole: () => Promise<void>
}

export const devToolsAPI: DevToolsAPI = {
  openConsole: () => ipcRenderer.invoke('dev:open-console')
}
