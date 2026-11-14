import { ipcRenderer } from 'electron'

export interface TodoAPI {
  getAll: () => Promise<object[]>
  create: (todo: unknown) => Promise<void>
  update: (id: string, todo: unknown) => Promise<unknown>
  remove: (id: string) => Promise<void>
  sync: () => Promise<void>
  subscribe: (callback: () => void) => () => void
}

export const todoAPI: TodoAPI = {
  getAll: () => ipcRenderer.invoke('todos:getAll'),
  create: (todo: unknown) => ipcRenderer.invoke('todos:create', todo),
  update: (id: string, todo: unknown) => ipcRenderer.invoke('todos:update', id, todo),
  remove: (id: string) => ipcRenderer.invoke('todos:remove', id),
  sync: () => ipcRenderer.invoke('todos:sync'),
  subscribe: (callback: () => void) => {
    const listener = () => callback()
    ipcRenderer.on('todos:changed', listener)
    return () => ipcRenderer.removeListener('todos:changed', listener)
  }
}
