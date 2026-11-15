import { ipcRenderer } from 'electron'
import { LocalTodo } from '@app-types/LocalTodo'

export interface LocalTodoStorageAPI {
  set: (todo: LocalTodo) => Promise<void>
  get: (key: string) => Promise<LocalTodo | undefined>
  getAll: () => Promise<Record<string, LocalTodo> | undefined>
  delete: (key: string) => Promise<void>
}

export const localTodoStorageAPI: LocalTodoStorageAPI = {
  set: (todo) => ipcRenderer.invoke('local-todo-api:set-setting', todo),
  get: (todoId) => ipcRenderer.invoke('local-todo-api:get-setting', todoId),
  delete: (key) => ipcRenderer.invoke('local-todo-api:delete-setting', key),
  getAll: () => ipcRenderer.invoke('local-todo-api:get-settings')
}
