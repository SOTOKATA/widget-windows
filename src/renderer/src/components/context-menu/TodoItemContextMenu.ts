import type { ContextMenuItem } from './contextMenu'
import { CircleX, Pencil, Pin, PinOff } from '@lucide/svelte'

export interface TodoItemContextMenuArgs {
  todoId: string
  pinned: boolean
  pin: (todoId: string) => void
  unpin: (todoId: string) => void
}

export const TodoItemPinContextMenu: ContextMenuItem[] = [
  {
    label: 'Pin',
    icon: Pin,
    action: (data: TodoItemContextMenuArgs) => data.pin(data.todoId)
  }
]

export const TodoItemUnpinContextMenu: ContextMenuItem[] = [
  {
    label: 'Unpin',
    icon: PinOff,
    action: (data: TodoItemContextMenuArgs) => data.unpin(data.todoId)
  }
]
export const TodoItemContextMenu: ContextMenuItem[] = [
  {
    label: 'Change',
    icon: Pencil,
    action: (data: TodoItemContextMenuArgs) => window.todoModalAPI.open('change', data.todoId)
  },
  {
    label: 'Delete',
    icon: CircleX,
    action: (data: TodoItemContextMenuArgs) => window.todoModalAPI.open('delete', data.todoId)
  }
]
