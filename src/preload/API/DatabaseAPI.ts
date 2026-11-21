import { ipcRenderer } from 'electron'
import type { DatabaseTodo } from '@app-types/DatabaseTodo'
import type { Todo } from '@app-types/Todo'

export interface DatabaseAPI {
  sync: () => Promise<void>
  todoAPI: TodoAPI
}

interface TodoAPI {
  getAll: () => Promise<DatabaseTodo[]>
  create: (todo: Todo) => Promise<void>
  update: (id: string, todo: Partial<Todo>) => Promise<DatabaseTodo[]>
  remove: (id: string) => Promise<void>
  subscribe: (callback: () => void) => () => void
}

export const databaseAPI: DatabaseAPI = {
  sync: () => ipcRenderer.invoke('database:sync'),
  todoAPI: {
    getAll: () => ipcRenderer.invoke('database:todos:getAll'),
    create: (todo: unknown) => ipcRenderer.invoke('database:todos:create', todo),
    update: (id: string, todo: unknown) => ipcRenderer.invoke('database:todos:update', id, todo),
    remove: (id: string) => ipcRenderer.invoke('database:todos:remove', id),
    subscribe: (callback: () => void) => {
      const listener = () => callback()
      ipcRenderer.on('database:todos:changed', listener)
      return () => ipcRenderer.removeListener('database:todos:changed', listener)
    }
  }
}
