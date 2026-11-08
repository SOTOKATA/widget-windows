import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  todos: {
    getAll: () => ipcRenderer.invoke('todos:getAll'),
    create: (todo: unknown) => ipcRenderer.invoke('todos:create', todo),
    update: (id: string, todo: unknown) => ipcRenderer.invoke('todos:update', id, todo),
    remove: (id: string) => ipcRenderer.invoke('todos:remove', id),
    sync: () => ipcRenderer.invoke('todos:sync')
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Failed to expose database API:', error)
  }

  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
  } catch (error) {
    console.error('Failed to expose Electron API:', error)
  }

  try {
    contextBridge.exposeInMainWorld('widget', {
      setFocusable: (value: boolean) => ipcRenderer.send('widget:focusable', value)
    })
  } catch (error) {
    console.error('Failed to expose widget API:', error)
  }
} else {
  Object.assign(window, { electron: electronAPI, api })
}
