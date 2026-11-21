import { ipcMain } from 'electron'
import Store from 'electron-store'
import { LocalTodo } from '@app-types/LocalTodo'

const store = new Store({
  defaults: {
    'todo-local-settings': {}
  }
})

ipcMain.handle('local-todo-api:get-settings', (_): LocalTodo[] | undefined => {
  try {
    return store.get('todo-local-settings') as LocalTodo[]
  } catch (e) {
    console.error('local-todo-api:get-settings.error', e)
  }

  return undefined
})

ipcMain.handle('local-todo-api:get-setting', (_, todoId: string): LocalTodo | undefined => {
  try {
    return store.get(`todo-local-settings.${todoId}`) as LocalTodo
  } catch (e) {
    console.error('local-todo-api:get-setting.error', e)
  }

  return undefined
})

ipcMain.handle('local-todo-api:set-setting', (_event, todo: LocalTodo) => {
  try {
    return store.set(`todo-local-settings.${todo.id}`, todo)
  } catch (e) {
    console.error('local-todo-api:set-setting.error', e)
  }
})

ipcMain.handle('local-todo-api:delete-setting', (_event, todoId: string) => {
  try {
    // @ts-ignore store.delete with this call exists
    store.delete(`todo-local-settings.${todoId}`)
    return true
  } catch (e) {
    console.error('local-todo-api:delete-setting.error', e)
    return false
  }
})
