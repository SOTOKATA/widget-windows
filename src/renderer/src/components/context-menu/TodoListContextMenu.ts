import type { ContextMenuItem } from './contextMenu'
import { Plus, Settings } from '@lucide/svelte'

export interface TodoListContextMenuArgs {
}
export const TodoListContextMenu: ContextMenuItem[] = [
  {
    label: "Add",
    icon: Plus,
    action: () => window.api.todoModal.open('add')
  },
  {
    label: 'Settings',
    icon: Settings,
    action: () => window.api.settings.open()
  }
]
