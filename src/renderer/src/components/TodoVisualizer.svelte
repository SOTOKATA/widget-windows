<script lang="ts">
  import { getDaysUntil } from '../typescript/adaptiveDate'
  import { Pin, LockKeyhole } from '@lucide/svelte'
  import type { Todo } from '@app-types/Todo'
  import { globals, onSettingsUpdate } from '../typescript/globals.svelte'
  import { createCustomMarked } from '../typescript/markedExtensions/custromMarked'
  import { onDestroy, onMount } from 'svelte'
  import { todoColors } from '../typescript/todoColors'
  import DOMPurify from 'dompurify';
  import { ChevronUp, ChevronDown } from '@lucide/svelte'

  interface Props {
    todo: Todo
    onUpdateTodo: (id: string, data: Partial<Todo>) => Promise<void>
    onChangeVisibilityTodo?: (id: string, closed: boolean) => Promise<void>
  }

  let { todo, onUpdateTodo, onChangeVisibilityTodo }: Props = $props()

  function completedTextClasses(): string {
    return completed ? ' line-through italic ' : ''
  }

  let completed: boolean = $state(todo.completed ?? false)

  async function toggleCompleted(): Promise<void> {
    await onUpdateTodo(todo.id, { completed })
  }

  async function toggleClosed(): Promise<void> {
    todo.closed = !todo.closed

    await onChangeVisibilityTodo?.(todo.id, todo.closed);
  }

  function bgClasses(): string {
    if (todo.completed) return 'bg-success/30 border border-success/40'

    if (todo.type === 'critical' || getDaysUntil(todo.completeUntil) === 'Today')
      return todoColors.critical
    else if (todo.type === 'important' || getDaysUntil(todo.completeUntil) === 'Tomorrow')
      return todoColors.important
    else if (todo.type === 'accent')
      return todoColors.accent
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

  function toggleSecret(event: MouseEvent): void {
    if (!todo.secret) {
      handleSecretClick(event)
      return
    }

    const target = event.target as HTMLElement
    if (target.closest('a') && !secret) return
    else event.preventDefault()

    if (target.closest('[data-secret]') && !secret) {
      handleSecretClick(event)
      return
    }

    secret = !secret
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
    <span
      class="absolute left-1/2 -translate-x-1/2 badge-sm bg-black/20 px-2 py-0.5 rounded-md"
    >
      {getDaysUntil(todo.completeUntil)}
    </span>
    {/if}

    <div class="flex flex-row gap-3 items-center ms-auto">
      {#if todo.pinned}
        <Pin size={14} class="opacity-70" />
      {/if}
    </div>

    <button
      class="btn btn-ghost btn-circle btn-xs shrink-0"
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
      onclick={(e) => toggleSecret(e)}
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
        {@html DOMPurify.sanitize(renderedDescription)}
      </p>
    </div>
  {/if}
</section>
