import { ElectronAPI } from '@electron-toolkit/preload'

interface TodoPayload {
  id: string
  title: string
  description?: string
  completed?: boolean
}

interface StoredTodo extends TodoPayload {
  description: string
  completed: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      todos: {
        getAll: () => Promise<StoredTodo[]>
        create: (todo: TodoPayload) => Promise<StoredTodo[]>
        update: (id: string, todo: Partial<TodoPayload>) => Promise<StoredTodo[]>
        remove: (id: string) => Promise<StoredTodo[]>
        sync: () => Promise<boolean>
      }
    }
    widget: {
      setFocusable: (value: boolean) => void
    }
  }
}
