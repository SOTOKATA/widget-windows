export interface DatabaseTodo {
  id: string
  title: string
  description: string
  completed: boolean
  secret: boolean
  type: string
  complete_until: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}
