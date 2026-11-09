import type { ContextMenuItem } from './contextMenu'
import { CircleX, Pencil } from '@lucide/svelte'

export interface TodoItemContextMenuArgs {
  todoId: string
}
export const TodoItemContextMenu: ContextMenuItem[] = [
  {
    label: 'Change',
    icon: Pencil,
    action: (data: TodoItemContextMenuArgs) => window.api.todoModal.open('change', data.todoId)
  },
  {
    label: 'Delete',
    icon: CircleX,
    action: (data: TodoItemContextMenuArgs) => window.api.todoModal.open('delete', data.todoId),
  }
]
