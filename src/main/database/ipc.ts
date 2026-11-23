import { BrowserWindow, ipcMain } from 'electron'
import { syncDatabase } from './sync'
import { databaseTodoActions } from './todos'
import { Todo } from '@app-types/Todo'

export async function initializeTursoDatabase(): Promise<void> {
  initializeIPC()

  if (process.env.TODO_TURSO_DATABASE_URL) {
    try {
      await syncDatabase()
    } catch (error) {
      console.warn('Turso sync is unavailable. Working with the local database.', error)
    }
  }
}

function initializeIPC(): void {
  ipcMain.handle('database:sync', () => syncDatabase())
  ipcMain.handle('database:todos:getAll', () => databaseTodoActions.getAll())
  ipcMain.handle('database:todos:create', async (_, todo: Todo) => {
    await databaseTodoActions.create(todo)
    await syncAfterMutation()
    notifyTodosChanged()
    return databaseTodoActions.getAll()
  })
  ipcMain.handle('database:todos:update', async (event, id: string, todo: Partial<Todo>) => {
    await databaseTodoActions.update(id, todo)
    await syncAfterMutation()
    notifyTodosChanged(event.sender)
    return databaseTodoActions.getAll()
  })
  ipcMain.handle('database:todos:remove', async (_, id: string) => {
    await databaseTodoActions.remove(id)
    await syncAfterMutation()
    notifyTodosChanged()
    return databaseTodoActions.getAll()
  })
}

function notifyTodosChanged(sender?: Electron.WebContents): void {
  BrowserWindow.getAllWindows().forEach((window) => {
    if (window.webContents !== sender) window.webContents.send('database:todos:changed')
  })
}

async function syncAfterMutation(): Promise<void> {
  if (!process.env.TODO_TURSO_DATABASE_URL) return

  await syncDatabase()
}
