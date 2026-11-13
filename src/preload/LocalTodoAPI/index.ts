import { ipcRenderer } from 'electron'

export const localTodoAPI = {
  set: (todo) => ipcRenderer.invoke('local-todo-api:set-setting', todo),
  get: (key: string) => ipcRenderer.invoke('local-todo-api:get-setting', key),
  delete: (key: string) => ipcRenderer.invoke('local-todo-api:delete-setting', key),
  getAll: () => ipcRenderer.invoke('local-todo-api:get-settings')
}
