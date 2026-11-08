import type { ContextMenuItem } from './contextMenu'
import { CircleX, Pencil } from '@lucide/svelte'

export interface TodoItemContextMenuArgs {
  changeTodoModal?: { openModal: () => void }
  deleteTodoModal?: HTMLDialogElement | undefined;
}
export const TodoItemContextMenu: ContextMenuItem[] = [
  {
    label: 'Change',
    icon: Pencil,
    action: (data: TodoItemContextMenuArgs) => data.changeTodoModal?.openModal()
  },
  {
    label: 'Delete',
    icon: CircleX,
    action: (data: TodoItemContextMenuArgs) => data.deleteTodoModal?.showModal(),
  }
]
