import { ipcMain } from 'electron'
import { syncTodos } from './sync'
import { create, getAll, initializeTodosTable, remove, update, type Todo } from './todos'

export async function initializeTursoDatabase(): Promise<void> {
  initializeIPC()
  await initializeTodosTable()

  if (process.env.TURSO_DATABASE_URL) {
    try {
      await syncTodos()
    } catch (error) {
      console.warn('Turso sync is unavailable. Working with the local database.', error)
    }
  }
}

function initializeIPC(): void {
  ipcMain.handle('todos:sync', () => syncTodos())
  ipcMain.handle('todos:getAll', () => getAll())
  ipcMain.handle('todos:create', async (_, todo: Todo) => {
    await create(todo)
    await syncAfterMutation()
    return getAll()
  })
  ipcMain.handle('todos:update', async (_, id: string, todo: Partial<Todo>) => {
    await update(id, todo)
    await syncAfterMutation()
    return getAll()
  })
  ipcMain.handle('todos:remove', async (_, id: string) => {
    await remove(id)
    await syncAfterMutation()
    return getAll()
  })
}

async function syncAfterMutation(): Promise<void> {
  if (!process.env.TURSO_DATABASE_URL) return

  await syncTodos()
}
