import { ipcRenderer } from 'electron'

export interface TodoModalAPI {
  open: (type: 'add' | 'change' | 'delete', todoId?: string) => Promise<void>,
  getData: () => Promise<any>,
  close: () => Promise<void>,
}


export const todoModalAPI: TodoModalAPI = {
  open: (type: 'add' | 'change' | 'delete', todoId?: string) => ipcRenderer.invoke('todo-modal:open', type, todoId),
  getData: () => ipcRenderer.invoke('todo-modal:get-data'),
  close: () => ipcRenderer.invoke('todo-modal:close')
}
