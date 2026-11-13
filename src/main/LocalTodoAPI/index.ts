import { ipcMain } from 'electron'
import Store from 'electron-store'
import { Todo } from './database/todos'

const store = new Store({
  defaults: {
    'todo-local-settings': {}
  }
})

ipcMain.handle('local-todo-api:get-settings', (_) => {
  return store.get('todo-local-settings')
})

ipcMain.handle('local-todo-api:get-setting', (_, todoId: string) => {
  return store.get(`todo-local-settings.${todoId}`)
})

ipcMain.handle('local-todo-api:set-setting', (event, todo: Todo) => {
  return store.set(todo.id, { alwaysOpen: todo.alwaysOpen })
})

ipcMain.handle('local-todo-api:delete-setting', (event, todoId: string) => {
  store.delete(`todo-local-settings.${todoId}`)
  return true
})
