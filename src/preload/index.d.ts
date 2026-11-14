import { ElectronAPI } from '@electron-toolkit/preload'
import { LocalTodoStorageAPI } from "./LocalTodoAPI";
import { TodoAPI } from "./TodoAPI";
import { TodoModalAPI } from "./TodoModalAPI";
import { SettingsAPI } from "./SettingsAPI";
import { DevToolsAPI } from "./devToolsAPI";

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
  bgTransparency: number
  position: 'left' | 'right'
  height: 'small' | 'medium' | 'full'
  width: 'small' | 'normal' | 'large'
}

declare global {
  interface Window {
    electron: ElectronAPI
    localTodoStorageAPI: LocalTodoStorageAPI
    todoAPI: TodoAPI
    todoModalAPI: TodoModalAPI
    settingsAPI: SettingsAPI
    devToolsAPI: DevToolsAPI
    widget: {
      setFocusable: (value: boolean) => void
    }
  }
}
