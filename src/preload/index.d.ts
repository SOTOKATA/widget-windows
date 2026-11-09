import { ElectronAPI } from '@electron-toolkit/preload'

interface TodoPayload {
  id: string
  title: string
  description?: string
  completed?: boolean
  type?: 'neutral' | 'important' | 'critical'
  completeUntil?: string
}

interface StoredTodo extends TodoPayload {
  description: string
  completed: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  complete_until: string | null
  type: 'neutral' | 'important' | 'critical'
}

interface WidgetSettings {
  autoLaunch: boolean
  position: 'left' | 'right'
  height: 'small' | 'medium' | 'full'
  width: 'small' | 'normal' | 'large'
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
      todoModal: {
        open: (type: 'add' | 'change' | 'delete', todoId?: string) => Promise<void>
        getData: () => Promise<{ type: 'add' | 'change' | 'delete'; todoId?: string }>
        close: () => Promise<void>
      }
      todosChanged: {
        subscribe: (callback: () => void) => () => void
      }
      settings: {
        open: () => Promise<void>
        get: () => Promise<WidgetSettings>
        save: (settings: WidgetSettings) => Promise<boolean>
      }
    }
    widget: {
      setFocusable: (value: boolean) => void
    }
  }
}
