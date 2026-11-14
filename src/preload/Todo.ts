export type TodoType = 'neutral' | 'important' | 'critical'

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
  alwaysOpen?: boolean
  pinned?: boolean
}
