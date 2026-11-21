import { Todo } from './Todo'

export interface LocalTodo {
  id: string
  pinned: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  openedSize: { width: number; height: number }
  closed: boolean
}

export function localTodoFromTodo(todo: Partial<Todo>): LocalTodo {
  const cleanTodo = JSON.parse(JSON.stringify(todo))

  return {
    id: cleanTodo.id,
    pinned: cleanTodo.pinned ?? false,
    position: cleanTodo.position ?? { x: 0, y: 0 },
    size: cleanTodo.size ?? { width: 4, height: 2 },
    openedSize: cleanTodo.openedSize ?? { width: 4, height: 2 },
    closed: cleanTodo.closed ?? false
  }
}
