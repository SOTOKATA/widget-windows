import { db } from './connection'

export interface DBTodo {
  id: string
  title: string
  description: string
  completed: boolean
  type: string
  complete_until: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

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

export type TodoType = 'neutral' | 'important'

export async function initializeTodosTable(): Promise<void> {
  return;

  await (await db).exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT
    )
  `)
}

export async function getAll(): Promise<DBTodo[]> {
  const stmt = await (await db).prepare(`
    SELECT * FROM todos WHERE deleted_at IS NULL ORDER BY created_at DESC
  `)
  return (await stmt.all()) as DBTodo[]
}

export async function create(todo: Todo): Promise<void> {
  const now = new Date().toISOString()
  const stmt = await (await db).prepare(`
    INSERT INTO todos (id, title, description, completed, created_at, updated_at, deleted_at, type, complete_until)
    VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)
  `)
  await stmt.run(
    todo.id,
    todo.title,
    todo.description ?? '',
    Number(todo.completed ?? false),
    todo.createdAt ?? now,
    now,
    todo.type,
    todo.completeUntil ?? null
  )
}

export async function update(id: string, data: Partial<Todo>): Promise<void> {
  const stmt = await (await db).prepare(`
    UPDATE todos SET title = COALESCE(?, title), description = COALESCE(?, description),
      completed = COALESCE(?, completed), type = COALESCE(?, type),
      complete_until = COALESCE(?, complete_until), updated_at = ?
    WHERE id = ? AND deleted_at IS NULL
  `)
  await stmt.run(
    data.title ?? null,
    data.description ?? null,
    data.completed === undefined ? null : Number(data.completed),
    data.type ?? null,
    data.completeUntil ?? null,
    new Date().toISOString(),
    id
  )
}

export async function remove(id: string): Promise<void> {
  const now = new Date().toISOString()
  const stmt = await (await db).prepare(`
    UPDATE todos SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL
  `)
  await stmt.run(now, now, id)
}
