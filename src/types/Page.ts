import { Todo } from '@app-types/Todo'

export interface Page {
  id: string
  title: string
  canDelete: boolean
  todos: Todo[]
  index: number
}

interface PageArgs {
  id?: string
  title?: string
  canDelete?: boolean
  todos?: Todo[]
  index?: number
}

export function createPage(args: PageArgs): Page {
  return {
    id: args.id ?? crypto.randomUUID(),
    title: args.title ?? 'page',
    canDelete: args.canDelete ?? true,
    todos: args.todos ?? [],
    index: args.index ?? 0
  }
}
