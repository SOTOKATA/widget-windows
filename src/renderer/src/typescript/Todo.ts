export interface Todo {
  id: string
  title: string
  description?: string
  completed?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
}

export function createTodo(data: { title: string, description?: string, completed?: boolean }): Todo {
  return {
    id: crypto.randomUUID(),
    ...data
  }
}
