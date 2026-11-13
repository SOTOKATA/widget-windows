import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { localTodoAPI } from './LocalTodoAPI'

const api = {
  todos: {
    getAll: () => ipcRenderer.invoke('todos:getAll'),
    create: (todo: unknown) => ipcRenderer.invoke('todos:create', todo),
    update: (id: string, todo: unknown) => ipcRenderer.invoke('todos:update', id, todo),
    remove: (id: string) => ipcRenderer.invoke('todos:remove', id),
    sync: () => ipcRenderer.invoke('todos:sync')
  },
  settings: {
    open: () => ipcRenderer.invoke('settings:open'),
    get: () => ipcRenderer.invoke('settings:get'),
    save: (settings: unknown) => ipcRenderer.invoke('settings:save', settings)
  },
  todoModal: {
    open: (type: 'add' | 'change' | 'delete', todoId?: string) => ipcRenderer.invoke('todo-modal:open', type, todoId),
    getData: () => ipcRenderer.invoke('todo-modal:get-data'),
    close: () => ipcRenderer.invoke('todo-modal:close')
  },
  todosChanged: {
    subscribe: (callback: () => void) => {
      const listener = () => callback()
      ipcRenderer.on('todos:changed', listener)
      return () => ipcRenderer.removeListener('todos:changed', listener)
    }
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('localTodoAPI', localTodoAPI)
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
      setFocusable: (value: boolean) =>
        ipcRenderer.send('widget:focusable', value)
    })
  } catch (error) {
    console.error('Failed to expose widget API:', error)
  }
} else {
  Object.assign(window, { electron: electronAPI, api })
}
