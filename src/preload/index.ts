import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { localTodoStorageAPI } from './API/LocalTodoAPI'
import { todoModalAPI } from './API/TodoModalAPI'
import { settingsAPI } from './API/SettingsAPI'
import { devToolsAPI } from './API/DevToolsAPI'
import { windowAPI } from './API/WindowAPI'
import { databaseAPI } from './API/DatabaseAPI'
import { version } from '../../package.json'
import { updateAPI } from './API/UpdateAPI'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('localTodoStorageAPI', localTodoStorageAPI)
    contextBridge.exposeInMainWorld('databaseAPI', databaseAPI)
    contextBridge.exposeInMainWorld('todoModalAPI', todoModalAPI)
    contextBridge.exposeInMainWorld('settingsAPI', settingsAPI)
    contextBridge.exposeInMainWorld('devToolsAPI', devToolsAPI)
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      appVersion: version
    })
    contextBridge.exposeInMainWorld('windowAPI', windowAPI)
    contextBridge.exposeInMainWorld('updateAPI', updateAPI)
    contextBridge.exposeInMainWorld('widget', {
      setFocusable: (value: boolean) => ipcRenderer.send('widget:focusable', value)
    })
  } catch (error) {
    console.error('Failed to expose APIs:', error)
  }
} else {
  Object.assign(window, { electron: electronAPI })
}
