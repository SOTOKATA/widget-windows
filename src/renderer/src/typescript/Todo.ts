export interface Todo {
  id: string
  title: string
  type: TodoType
  completeUntil?: string
  description?: string
  completed?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
}

export type TodoType = 'neutral' | 'important' | 'critical'

export const TodoTypes: { label: string, value: TodoType }[] = [
  { label: 'Neutral', value: 'neutral' },
  { label: 'Important', value: 'important' },
  { label: 'Critical', value: 'critical' },
]

export function createTodo(data: { title: string, description?: string, completed?: boolean, completeUntil?: string; type?: TodoType }): Todo {
  return {
    id: crypto.randomUUID(),
    ...data,
    type: data.type ?? 'neutral'
  }
}
