import type { ContextMenuItem } from './contextMenu'
import { Plus } from '@lucide/svelte'

export interface TodoListContextMenuArgs {
  addTodoModal?: HTMLDialogElement | undefined;
}
export const TodoListContextMenu: ContextMenuItem[] = [
  {
    label: "Add",
    icon: Plus,
    action: (data: TodoListContextMenuArgs) => data.addTodoModal?.showModal()
  }
]
