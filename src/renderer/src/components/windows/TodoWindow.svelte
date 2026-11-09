<script lang="ts">
  import type { Todo } from '../../typescript/Todo'
  import type { ContextMenuData } from '../context-menu/ContextMenuData'
  import { TodoListContextMenu } from '../context-menu/TodoListContextMenu'
  import { TodoItemContextMenu } from '../context-menu/TodoItemContextMenu'
  import { onMount } from 'svelte'
  import TodoVisualizer from "../TodoVisualizer.svelte";
  import TodoHeader from "../TodoHeader.svelte";
  import ContextMenu from "../context-menu/ContextMenu.svelte";

  let todos: Todo[] = $state([])
  let selectedTodoId = $state('')
  let selectedTodo: Todo | undefined = $state()
  let currentContextMenuData: ContextMenuData | undefined = $state()
  let openContextMenu: ((mouseEvent: MouseEvent) => void) | undefined = $state()

  function mapTodos(rows: Awaited<ReturnType<typeof window.api.todos.getAll>>): Todo[] {
    return rows.map((todo) => ({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.created_at,
      updatedAt: todo.updated_at,
      deletedAt: todo.deleted_at ?? undefined,
      completeUntil: todo.complete_until ?? undefined,
      type: todo.type
    }))
  }

  async function loadTodos(): Promise<void> {
    todos = mapTodos(await window.api.todos.getAll())
  }

  async function syncTodos(): Promise<void> {
    await window.api.todos.sync()
    await loadTodos()
  }

  async function onUpdateTodo(id: string, data: Partial<Todo>): Promise<void> {
    todos = mapTodos(await window.api.todos.update(id, data))
  }

  function showContextMenu(event: MouseEvent): void {
    event.preventDefault()
    const element = (event.target as HTMLElement).closest<HTMLElement>('[data-menu-type]')
    selectedTodoId = element?.dataset.id ?? ''
    selectedTodo = todos.find((todo) => todo.id === selectedTodoId)

    if (!selectedTodo) {
      currentContextMenuData = { items: TodoListContextMenu, data: {} }
    } else {
      currentContextMenuData = {
        items: TodoItemContextMenu,
        data: { todoId: selectedTodo.id }
      }
    }
    openContextMenu?.(event)
  }

  onMount(() => {
    void loadTodos()
    return window.api.todosChanged.subscribe(() => void loadTodos())
  })

</script>

<ContextMenu bind:openContextMenu data={currentContextMenuData} />

<main class="w-full h-full max-h-full flex flex-col gap-3 bg-black/10 py-1 px-2">
  <TodoHeader {todos} onSync={syncTodos} />
  <div class="max-h-full overflow-auto h-full flex flex-col gap-3 no-scrollbar" oncontextmenu={showContextMenu}>
    {#each todos as todo (todo.id)}
      <TodoVisualizer {todo} {onUpdateTodo} />
    {/each}
  </div>
</main>
