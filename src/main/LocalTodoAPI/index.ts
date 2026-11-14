import { ipcMain } from 'electron'
import Store from 'electron-store'
import { Todo } from '../database/todos'

const store = new Store({
  defaults: {
    'todo-local-settings': {}
  }
})

ipcMain.handle('local-todo-api:get-settings', (_) => {
  try {
    return store.get('todo-local-settings')
  } catch (e) {
    console.error('local-todo-api:get-settings.error', e)
  }
})

ipcMain.handle('local-todo-api:get-setting', (_, todoId: string) => {
  try {
    return store.get(`todo-local-settings.${todoId}`)
  } catch (e) {
    console.error('local-todo-api:get-setting.error', e)
  }
})

ipcMain.handle('local-todo-api:set-setting', (event, todo: Todo) => {
  try {
    return store.set(`todo-local-settings.${todo.id}`, {
      alwaysOpen: todo.alwaysOpen,
      pinned: todo.pinned
    })
  } catch (e) {
    console.error('local-todo-api:set-setting.error', e)
  }
})

ipcMain.handle('local-todo-api:delete-setting', (event, todoId: string) => {
  try {
    store.delete(`todo-local-settings.${todoId}`)
    return true
  } catch (e) {
    console.error('local-todo-api:delete-setting.error', e)
  }
})
