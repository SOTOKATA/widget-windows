import { DatabaseTodo } from '@app-types/DatabaseTodo'
import { Todo } from '@app-types/Todo'
import { dbPromise } from './connection'

export const databaseTodoActions = {
  async getAll(): Promise<DatabaseTodo[]> {
    const db = await dbPromise

    const stmt = await db.prepare(`
      SELECT * FROM todos WHERE deleted_at IS NULL ORDER BY created_at DESC
    `)
    return (await stmt.all()) as DatabaseTodo[]
  },

  async create(todo: Todo): Promise<void> {
    const db = await dbPromise

    const now = new Date().toISOString()
    const stmt = await db.prepare(`
      INSERT INTO todos (id, title, description, completed, created_at, updated_at, deleted_at, type, complete_until, secret)
      VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?, ?)
    `)
    await stmt.run(
      todo.id,
      todo.title,
      todo.description ?? '',
      Number(todo.completed ?? false),
      todo.createdAt ?? now,
      now,
      todo.type,
      todo.completeUntil ?? null,
      Number(todo.secret ?? false)
    )
  },

  async update(id: string, data: Partial<Todo>): Promise<void> {
    const db = await dbPromise

    const stmt = await db.prepare(`
      UPDATE todos SET title = COALESCE(?, title), description = COALESCE(?, description),
        completed = COALESCE(?, completed), type = COALESCE(?, type),
        complete_until = COALESCE(?, complete_until), secret = COALESCE(?, secret), updated_at = ?
      WHERE id = ? AND deleted_at IS NULL
    `)
    await stmt.run(
      data.title ?? null,
      data.description ?? null,
      data.completed === undefined ? null : Number(data.completed),
      data.type ?? null,
      data.completeUntil ?? null,
      data.secret === undefined ? null : Number(data.secret),
      new Date().toISOString(),
      id
    )
  },

  async remove(id: string): Promise<void> {
    const db = await dbPromise

    const now = new Date().toISOString()
    const stmt = await db.prepare(`
      UPDATE todos SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL
    `)
    await stmt.run(now, now, id)
  }
}
