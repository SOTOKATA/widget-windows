import { ipcRenderer } from 'electron'
import { Todo } from '../Todo'

export interface LocalTodoStorageAPI {
  set: (todo: Todo) => Promise<void>
  get: (key: string) => Promise<object | undefined>
  getAll: () => Promise<object[] | undefined>
  delete: (key: string) => Promise<void>
}

export const localTodoStorageAPI: LocalTodoStorageAPI = {
  set: (todo) => ipcRenderer.invoke('local-todo-api:set-setting', todo),
  get: (key) => ipcRenderer.invoke('local-todo-api:get-setting', key),
  delete: (key) => ipcRenderer.invoke('local-todo-api:delete-setting', key),
  getAll: () => ipcRenderer.invoke('local-todo-api:get-settings')
}
