import { ElectronAPI } from '@electron-toolkit/preload'
import { LocalTodoStorageAPI } from './API/LocalTodoAPI'
import { TodoModalAPI } from './API/TodoModalAPI'
import { SettingsAPI } from './API/SettingsAPI'
import { DevToolsAPI } from './API/DevToolsAPI'
import { WindowAPI } from './API/WindowAPI'
import { DatabaseAPI } from "./API/DatabaseAPI";

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
    electron: ElectronAPI & { appVersion: string }
    localTodoStorageAPI: LocalTodoStorageAPI
    windowAPI: WindowAPI
    databaseAPI: DatabaseAPI
    todoModalAPI: TodoModalAPI
    settingsAPI: SettingsAPI
    devToolsAPI: DevToolsAPI
    widget: {
      setFocusable: (value: boolean) => void
    }
  }
}
