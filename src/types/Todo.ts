export interface Todo {
  id: string
  title: string
  type: TodoType
  secret: boolean
  completeUntil?: string
  description?: string
  completed: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  pinned?: boolean
  position?: { x: number; y: number }
  size?: { width: number; height: number }
}

export type TodoType = 'neutral' | 'important' | 'critical'

export interface TodoDataArgs {
  id?: string
  title?: string
  type?: TodoType
  completeUntil?: string
  description?: string
  completed?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  secret?: boolean
  pinned?: boolean
  position?: { x: number; y: number }
  size?: { width: number; height: number }
}

export const TodoTypes: { label: string; value: TodoType }[] = [
  { label: 'Neutral', value: 'neutral' },
  { label: 'Important', value: 'important' },
  { label: 'Critical', value: 'critical' }
]

export function createTodo(data: TodoDataArgs): Todo {
  return {
    id: data.id ?? crypto.randomUUID(),
    title: data.title ?? 'title',
    type: data.type ?? 'neutral',
    completeUntil: data.completeUntil,
    description: data.description,
    completed: data.completed ?? false,
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString(),
    deletedAt: data.deletedAt,
    pinned: data.pinned,
    position: data.position ?? { x: 0, y: 0 },
    size: data.size ?? { width: 4, height: 2 }
  }
}
