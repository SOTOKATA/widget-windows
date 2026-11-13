export interface Todo {
  id?: string
  title?: string
  type?: TodoType
  completeUntil?: string
  description?: string
  completed?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  alwaysOpen?: boolean
}

export type TodoType = 'neutral' | 'important' | 'critical'

export const TodoTypes: { label: string, value: TodoType }[] = [
  { label: 'Neutral', value: 'neutral' },
  { label: 'Important', value: 'important' },
  { label: 'Critical', value: 'critical' },
]

export function createTodo(data: Todo): Todo {
  return {
    ...data,
    id: data.id ?? crypto.randomUUID(),
    type: data.type ?? 'neutral'
  }
}
