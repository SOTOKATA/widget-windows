import { BrowserWindow, ipcMain } from 'electron'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

export type TodoModalType = 'add' | 'change' | 'delete'

interface TodoModalData {
  type: TodoModalType
  todoId?: string
}

const modalData = new WeakMap<BrowserWindow, TodoModalData>()
let todoModalWindow: BrowserWindow | null = null

export function openTodoModal(type: TodoModalType, todoId?: string): void {
  if (todoModalWindow && !todoModalWindow.isDestroyed()) {
    todoModalWindow.close()
  }

  const window = new BrowserWindow({
    width: type === 'delete' ? 400 : 1000,
    height: type === 'delete' ? 170 : 680,
    minWidth: type === 'delete' ? 400 : 300,
    minHeight: type === 'delete' ? 170 : 580,
    icon,
    thickFrame: true,
    resizable: true,
    transparent: true,
    frame: false,
    autoHideMenuBar: true,
    title: type === 'add' ? 'Add Todo' : type === 'change' ? 'Change Todo' : 'Delete Todo',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  todoModalWindow = window
  modalData.set(window, { type, todoId })
  window.removeMenu()

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    void window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/todo-modal/${type}`)
  } else {
    void window.loadFile(join(__dirname, '../renderer/index.html'), { hash: `/todo-modal/${type}` })
  }

  window.on('closed', () => {
    if (todoModalWindow === window) todoModalWindow = null
  })
}

export function initializeTodoModalWindow(): void {
  ipcMain.handle('todo-modal:open', (_, type: TodoModalType, todoId?: string) => {
    if (!['add', 'change', 'delete'].includes(type)) throw new Error('Invalid todo modal type')
    if (type !== 'add' && !todoId) throw new Error('Todo ID is required')
    openTodoModal(type, todoId)
  })

  ipcMain.handle('todo-modal:get-data', (event): TodoModalData => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (!window) throw new Error('Todo modal window not found')

    const data = modalData.get(window)
    if (!data) throw new Error('Todo modal data not found')
    return data
  })

  ipcMain.handle('todo-modal:close', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close()
  })
}
