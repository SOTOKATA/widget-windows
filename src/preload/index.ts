import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { localTodoStorageAPI } from './LocalTodoAPI'
import { todoModalAPI } from './TodoModalAPI'
import { todoAPI } from './TodoAPI'
import { settingsAPI } from './SettingsAPI'
import { devToolsAPI } from './devToolsAPI'
import { windowAPI } from './windowAPI'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('localTodoStorageAPI', localTodoStorageAPI)
    contextBridge.exposeInMainWorld('todoAPI', todoAPI)
    contextBridge.exposeInMainWorld('todoModalAPI', todoModalAPI)
    contextBridge.exposeInMainWorld('settingsAPI', settingsAPI)
    contextBridge.exposeInMainWorld('devToolsAPI', devToolsAPI)
    contextBridge.exposeInMainWorld('windowAPI', windowAPI)
  } catch (error) {
    console.error('Failed to expose APIs:', error)
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
  Object.assign(window, { electron: electronAPI })
}
