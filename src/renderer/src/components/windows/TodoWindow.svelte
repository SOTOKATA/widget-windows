<script lang="ts">
  import { type Todo, createTodo } from '../../typescript/Todo'
  import type { ContextMenuData } from '../context-menu/ContextMenuData'
  import { TodoListContextMenu } from '../context-menu/TodoListContextMenu'
  import {
    TodoItemContextMenu,
    TodoItemPinContextMenu,
    TodoItemUnpinContextMenu
  } from '../context-menu/TodoItemContextMenu'
  import { onDestroy, onMount } from 'svelte'
  import TodoVisualizer from '../TodoVisualizer.svelte'
  import TodoHeader from '../TodoHeader.svelte'
  import ContextMenu from '../context-menu/ContextMenu.svelte'
  import { globals, onSettingsUpdate } from '../../typescript/globals.svelte'
  import type { Settings } from '../../typescript/Settings'
  import Grid, { GridItem, type LayoutChangeDetail } from '@appulsauce/svelte-grid'
  import { GripVertical } from '@lucide/svelte'

  let todos: Todo[] = $state([])
  let selectedTodoId = $state('')
  let selectedTodo: Todo | undefined = $state()
  let currentContextMenuData: ContextMenuData | undefined = $state()
  let openContextMenu: ((mouseEvent: MouseEvent) => void) | undefined = $state()

  function mapTodos(rows: Awaited<ReturnType<typeof window.todoAPI.getAll>>, localTodos): Todo[] {
    const localTodoIds = Object.keys(localTodos)

    return rows
      .map((todo) => {
        const localTodoSettingsExists = localTodoIds.some((x) => x === todo.id)

        return {
          id: todo.id,
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
          createdAt: todo.created_at,
          updatedAt: todo.updated_at,
          deletedAt: todo.deleted_at ?? undefined,
          completeUntil: todo.complete_until ?? undefined,
          type: todo.type,
          ...(localTodoSettingsExists ? localTodos[todo.id] : [])
        }
      })
      .sort((a, b) => {
        const pinA = a?.pinned ? 1 : 0
        const pinB = b?.pinned ? 1 : 0
        return pinB - pinA
      })
  }

  function refreshSort(): void {
    todos = todos.sort((a, b) => {
      const pinA = a?.pinned ? 1 : 0
      const pinB = b?.pinned ? 1 : 0
      return pinB - pinA
    })
  }

  async function loadTodos(): Promise<void> {
    todos = mapTodos(await window.todoAPI.getAll(), await window.localTodoStorageAPI.getAll())
  }

  async function syncTodos(): Promise<void> {
    await window.todoAPI.sync()
    await loadTodos()
  }

  async function onUpdateTodo(id: string, data: Partial<Todo>): Promise<void> {
    todos = mapTodos(
      await window.todoAPI.update(id, data),
      await window.localTodoStorageAPI.getAll()
    )
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
        items: [
          ...TodoListContextMenu,
          ...(selectedTodo.pinned ? TodoItemUnpinContextMenu : TodoItemPinContextMenu),
          ...TodoItemContextMenu
        ],
        data: {
          todoId: selectedTodo.id,
          pinned: selectedTodo.pinned,
          pin: () => todoPin(),
          unpin: () => todoUnpin()
        }
      }
    }
    openContextMenu?.(event)
  }

  let settingsUpdateUnsubscribe: (() => void) | undefined = $state()

  onDestroy(() => {
    settingsUpdateUnsubscribe?.()
  })

  onMount(() => {
    settingsUpdateUnsubscribe = onSettingsUpdate((s) => {
      refreshBgTransparency(s)
      refreshBorderTransparency(s)
    })
    void loadTodos()
    return window.todoAPI.subscribe(() => void loadTodos())
  })

  async function todoPin(): Promise<void> {
    selectedTodo.pinned = true
    const todo = await window.localTodoStorageAPI.get(selectedTodo.id)
    await window.localTodoStorageAPI.set(
      createTodo({
        ...(todo ?? []),
        id: selectedTodo.id,
        pinned: true
      })
    )
    refreshSort()
  }

  async function todoUnpin(): Promise<void> {
    selectedTodo.pinned = false
    const todo = await window.localTodoStorageAPI.get(selectedTodo.id)
    await window.localTodoStorageAPI.set(
      createTodo({
        ...(todo ?? []),
        id: selectedTodo.id,
        pinned: false
      })
    )
    refreshSort()
  }

  const transparencies = {
    100: '',
    90: 'bg-black/10',
    80: 'bg-black/20',
    70: 'bg-black/30',
    60: 'bg-black/40',
    50: 'bg-black/50',
    40: 'bg-black/60',
    30: 'bg-black/70',
    20: 'bg-black/80',
    10: 'bg-black/90',
    0: 'bg-black'
  }

  const borderTransparencies = {
    100: '',
    90: 'border-black/10',
    80: 'border-black/20',
    70: 'border-black/30',
    60: 'border-black/40',
    50: 'border-black/50',
    40: 'border-black/60',
    30: 'border-black/70',
    20: 'border-black/80',
    10: 'border-black/90',
    0: 'border-black'
  }

  function refreshBgTransparency(s: Settings): void {
    bgTransparency = transparencies[s.bgTransparency]
  }

  function refreshBorderTransparency(s: Settings): void {
    borderTransparency = borderTransparencies[s.bgTransparency]
  }

  let bgTransparency: string = $state(transparencies[globals.settings.bgTransparency])
  let borderTransparency: string = $state(borderTransparencies[globals.settings.bgTransparency]);
  async function handleItemChange(detail: LayoutChangeDetail): Promise<void> {
    const todo = todos.find((x) => x.id === detail.item.id)

    if (!todo) return

    await window.localTodoStorageAPI.set({
      ...todo,
      pinned: todo.pinned,
      alwaysOpen: todo.alwaysOpen,
      position: { x: detail.item.x, y: detail.item.y },
      size: { width: detail.item.w, height: detail.item.h }
    })
  }
</script>

<ContextMenu bind:openContextMenu data={currentContextMenuData} />

<main
  class="w-full h-full max-h-full flex flex-col gap-3 {bgTransparency} border {borderTransparency} py-1 px-2 border-b
   duration-250 transition-colors border-accent/50 rounded-md"
>
  <TodoHeader {todos} onSync={syncTodos} />
  <div
    class="max-h-full overflow-auto h-full flex flex-col gap-3 no-scrollbar md:hidden"
    oncontextmenu={showContextMenu}
  >
    {#each todos as todo (todo.id)}
      <TodoVisualizer {todo} {onUpdateTodo} />
    {/each}
  </div>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="hidden md:block w-full h-full" oncontextmenu={showContextMenu}>
    <Grid cols={10} rows={15} collision="push" itemSize={{ height: 50 }}>
      {#each todos as todo (todo.id)}
        <GridItem
          activeClass="opacity-30 scale-[1.02] shadow-lg"
          previewClass="bg-primary/20 border-2 border-dashed border-primary rounded-lg"
          class="relative"
          onchange={handleItemChange}
          id={todo.id}
          x={todo?.position?.x ?? 0}
          y={todo?.position?.y ?? 0}
          w={todo?.size?.width ?? 1}
          h={todo?.size?.height ?? 1}
        >
          {#snippet moveHandle({ moveStart })}
            <div onpointerdown={moveStart} class="cursor-move touch-none absolute top-3 right-3">
              <GripVertical size={16} />
            </div>
          {/snippet}
          <TodoVisualizer {todo} {onUpdateTodo} />
        </GridItem>
      {/each}
    </Grid>
  </div>

  <div class="flex flex-row justify-end">
    <button
      class="btn btn-xs btn-neutral opacity-70 font-mono"
      onclick={() => window.devToolsAPI.openConsole()}
    >
      dev
    </button>
  </div>
</main>

<style>
  .drag {
    -webkit-app-region: drag;
    app-region: drag;
  }

  .no-drag {
    -webkit-app-region: no-drag;
    app-region: no-drag;
  }

  button {
    -webkit-app-region: no-drag;
    app-region: no-drag;
  }

  .text {
    -webkit-app-region: no-drag;
    app-region: no-drag;
  }
</style>
