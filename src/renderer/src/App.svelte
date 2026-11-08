<script lang="ts">
  import TodoHeader from './components/TodoHeader.svelte'
  import type { Todo } from './typescript/Todo'
  import TodoVisualizer from './components/TodoVisualizer.svelte'
  import ContextMenu from './components/context-menu/ContextMenu.svelte'
  import type { ContextMenuData } from './components/context-menu/ContextMenuData'
  import { TodoListContextMenu } from './components/context-menu/TodoListContextMenu'
  import { TodoItemContextMenu } from './components/context-menu/TodoItemContextMenu'
  import DeleteTodoModal from './components/modal/DeleteTodoModal.svelte'
  import AddTodoModal from './components/modal/AddTodoModal.svelte'
  import ChangeTodoModal from './components/modal/ChangeTodoModal.svelte'
  import { onMount } from 'svelte'

  let todos: Todo[] = $state([])
  let selectedTodoId = $state('')
  let selectedTodo: Todo | undefined = $state()
  let currentContextMenuData: ContextMenuData | undefined = $state()
  let openContextMenu: ((mouseEvent: MouseEvent) => void) | undefined = $state()
  let addTodoModal: HTMLDialogElement | undefined = $state()
  let changeTodoModal: { openModal: () => void } | undefined = $state()
  let deleteTodoModal: HTMLDialogElement | undefined = $state()

  function mapTodos(rows: Awaited<ReturnType<typeof window.api.todos.getAll>>): Todo[] {
    return rows.map((todo) => ({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.created_at,
      updatedAt: todo.updated_at,
      deletedAt: todo.deleted_at ?? undefined
    }))
  }

  async function loadTodos(): Promise<void> {
    todos = mapTodos(await window.api.todos.getAll())
  }

  async function syncTodos(): Promise<void> {
    await window.api.todos.sync()
    await loadTodos()
  }

  function onAddTodo(todo: Todo): void {
    todos = [todo, ...todos]
  }

  function onDeleteTodo(id: string): void {
    todos = todos.filter((todo) => todo.id !== id)
  }

  async function onUpdateTodo(id: string, data: Partial<Todo>): Promise<void> {
    todos = mapTodos(await window.api.todos.update(id, data))
  }

  async function onChangeTodo(id: string, data: Pick<Todo, 'title' | 'description'>): Promise<void> {
    await onUpdateTodo(id, data)
  }

  function showContextMenu(event: MouseEvent): void {
    event.preventDefault()
    const element = (event.target as HTMLElement).closest<HTMLElement>('[data-menu-type]')
    selectedTodoId = element?.dataset.id ?? ''
    selectedTodo = todos.find((todo) => todo.id === selectedTodoId)

    if (!selectedTodo) {
      currentContextMenuData = { items: TodoListContextMenu, data: { addTodoModal } }
    } else {
      currentContextMenuData = {
        items: TodoItemContextMenu,
        data: { changeTodoModal, deleteTodoModal }
      }
    }
    openContextMenu?.(event)
  }

  onMount(loadTodos)
</script>

<DeleteTodoModal {onDeleteTodo} todo={selectedTodo} bind:modal={deleteTodoModal} />
<AddTodoModal {onAddTodo} bind:modal={addTodoModal} />
<ChangeTodoModal {onChangeTodo} todo={selectedTodo} bind:this={changeTodoModal} />
<ContextMenu bind:openContextMenu data={currentContextMenuData} />

<main class="w-full h-full max-h-full flex flex-col gap-3">
  <TodoHeader {todos} {addTodoModal} onSync={syncTodos} />
  <div class="max-h-full overflow-auto h-full flex flex-col gap-3 no-scrollbar" oncontextmenu={showContextMenu}>
    {#each todos as todo (todo.id)}
      <TodoVisualizer {todo} {onUpdateTodo} />
    {/each}
  </div>
</main>
