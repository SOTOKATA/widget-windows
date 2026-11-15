import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { localTodoStorageAPI } from './API/LocalTodoAPI'
import { todoAPI } from './API/TodoAPI'
import { todoModalAPI } from './API/TodoModalAPI'
import { settingsAPI } from './API/SettingsAPI'
import { devToolsAPI } from './API/DevToolsAPI'
import { windowAPI } from './API/WindowAPI'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('localTodoStorageAPI', localTodoStorageAPI)
    contextBridge.exposeInMainWorld('todoAPI', todoAPI)
    contextBridge.exposeInMainWorld('todoModalAPI', todoModalAPI)
    contextBridge.exposeInMainWorld('settingsAPI', settingsAPI)
    contextBridge.exposeInMainWorld('devToolsAPI', devToolsAPI)
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('windowAPI', windowAPI)
    contextBridge.exposeInMainWorld('widget', {
      setFocusable: (value: boolean) => ipcRenderer.send('widget:focusable', value)
    })
  } catch (error) {
    console.error('Failed to expose APIs:', error)
  }
} else {
  Object.assign(window, { electron: electronAPI })
}
