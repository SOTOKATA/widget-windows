<script lang="ts">
  import { getDaysUntil } from '../typescript/adaptiveDate'
  import { Pin, LockKeyhole } from '@lucide/svelte'
  import type { Todo } from '@app-types/Todo'
  import { globals, onSettingsUpdate } from '../typescript/globals.svelte'
  import { createCustomMarked } from '../typescript/markedExtensions/custromMarked'
  import { onDestroy, onMount } from 'svelte'
  import { todoColors } from '../typescript/todoColors'
  import DOMPurify from 'dompurify'
  import { ChevronUp, ChevronDown } from '@lucide/svelte'
  import { toggleMarkdownCheckbox } from '../typescript/markedExtensions/markdownCheckbox'

  interface Props {
    todo: Todo
    onUpdateTodo: (id: string, data: Partial<Todo>) => Promise<void>
    onChangeVisibilityTodo?: (id: string, closed: boolean) => Promise<void>
  }

  let { todo, onUpdateTodo, onChangeVisibilityTodo }: Props = $props()

  function completedTextClasses(): string {
    return completed ? ' line-through italic ' : ''
  }

  // svelte-ignore state_referenced_locally
  let completed: boolean = $state(todo.completed ?? false)

  async function toggleCompleted(): Promise<void> {
    await updateTodo({ completed })
  }

  async function updateTodo(data: Partial<Todo>): Promise<void> {
    await onUpdateTodo(todo.id, data)
    Object.assign(todo, data)
  }

  async function toggleClosed(): Promise<void> {
    todo.closed = !todo.closed

    await onChangeVisibilityTodo?.(todo.id, todo.closed)
  }

  function bgClasses(): string {
    if (todo.completed) return 'bg-success/30 border border-success/40'

    if (todo.type === 'critical' || getDaysUntil(todo.completeUntil) === 'Today')
      return todoColors.critical
    else if (todo.type === 'important' || getDaysUntil(todo.completeUntil) === 'Tomorrow')
      return todoColors.important
    else if (todo.type === 'accent') return todoColors.accent
    else return todoColors.normal
  }

  let unsubscribeSettingsUpdate: (() => void) | undefined = $state()
  onMount(() => {
    unsubscribeSettingsUpdate = onSettingsUpdate(
      (s) => (customMarked = createCustomMarked(s.markdownSettings))
    )
  })

  onDestroy(() => {
    unsubscribeSettingsUpdate?.()
  })

  let customMarked = $state(createCustomMarked(globals.settings.markdownSettings))

  function handleSecretClick(event: MouseEvent): boolean {
    const target = event.target as HTMLElement
    const secret = target.closest('[data-secret]') as HTMLElement | null

    if (!secret) return false

    secret.classList.toggle('blur-xs')
    secret.classList.toggle('blur-none')

    return true
  }

  function toggleSecret(): void {
    if (!todo.secret) return
    secret = !secret
  }

  async function toggleDescriptionCheckbox(event: MouseEvent): Promise<boolean> {
    const target = event.target as HTMLElement
    const item = target.closest('li[data-task-item]')
    if (!item || !todo.description) return false

    const taskItems = Array.from(item.parentElement?.querySelectorAll('li[data-task-item]') ?? [])
    const targetIndex = taskItems.indexOf(item)
    if (targetIndex < 0) return false


    const description = toggleMarkdownCheckbox(todo.description, targetIndex)

    const taskItem = taskItems[targetIndex]

    taskItem.classList.toggle('line-through')
    taskItem.classList.toggle('italic')

    if (description === todo.description) return false

    await updateTodo({ description })

    return true
  }

  function handleLinkClick(event: MouseEvent): boolean {
    if ((event.target as HTMLElement).closest('a') && !secret) return true

    event.preventDefault()
    return false
  }

  async function handleDescriptionClick(event: MouseEvent): Promise<void> {
    if (secret) {
      toggleSecret()
      return
    }

    if (handleSecretClick(event)) return
    if (handleLinkClick(event)) return
    if (await toggleDescriptionCheckbox(event)) return

    if (todo.secret) toggleSecret()
  }

  let renderedDescription = $derived(todo.description ? customMarked.parse(todo.description) : '')
  let secret: boolean = $derived(todo.secret)
</script>

<section
  class="flex flex-col {bgClasses()} duration-250 transition-colors px-3 py-2 rounded-md w-full h-full pe-8"
  data-menu-type
  data-id={todo.id}
>
  <label class="relative flex flex-row gap-3 w-full items-center justify-between">
    <div class="flex flex-row gap-3 items-center min-w-0">
      <input
        type="checkbox"
        class="checkbox checkbox-sm checkbox-ghost"
        bind:checked={completed}
        onchange={() => toggleCompleted()}
      />
      <span class="font-semibold cursor-pointer truncate {completedTextClasses()}">
        {todo.title}
      </span>
    </div>

    {#if todo.completeUntil}
      <span class="absolute left-1/2 -translate-x-1/2 badge-sm bg-black/20 px-2 py-0.5 rounded-md">
        {getDaysUntil(todo.completeUntil)}
      </span>
    {/if}

    <div class="flex flex-row gap-3 items-center ms-auto">
      {#if todo.pinned}
        <Pin size={14} class="opacity-70" />
      {/if}
    </div>

    <button
      class="btn btn-circle btn-xs shrink-0 border-transparent bg-transparent hover:bg-transparent active:bg-transparent shadow-none"
      type="button"
      onclick={() => toggleClosed()}
    >
      {#if todo.closed}
        <ChevronUp size={14} />
      {:else}
        <ChevronDown size={14} />
      {/if}
    </button>
  </label>

  {#if todo.description && !todo.closed}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="flex flex-row gap-3 w-full items-center overflow-scroll no-scrollbar w-full h-full relative"
      onclick={(e) => {
        handleDescriptionClick(e)
      }}
    >
      {#if secret}
        <span class="absolute flex flex-col w-full h-full items-center justify-center opacity-70">
          <LockKeyhole size={16} />
        </span>
      {/if}
      <input type="checkbox" readonly class="checkbox checkbox-sm checkbox-ghost invisible" />
      <p
        class="markdown opacity-90 {completedTextClasses()} duration-200 transition-all w-full h-full
              {todo.secret ? 'hover:cursor-pointer' : ''} {secret ? 'blur-xs' : ''}"
      >
        {#await renderedDescription then rDescription}
          {@html DOMPurify.sanitize(rDescription, {
            ADD_ATTR: ['target']
          })}
        {/await}
      </p>
    </div>
  {/if}
</section>
