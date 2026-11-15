<script lang="ts">
  import { getDaysUntil } from '../typescript/adaptiveDate'
  import { Marked, type Tokens } from 'marked'
  import { Pin } from '@lucide/svelte'
  import type { Todo } from '@app-types/Todo'
  import { secretAreaExtension } from "../typescript/markedExtensions/secretAreaExtension";

  interface Props {
    todo: Todo
    onUpdateTodo: (id: string, data: Partial<Todo>) => Promise<void>
  }

  let { todo, onUpdateTodo }: Props = $props()

  function completedTextClasses(): string {
    return completed ? ' line-through italic ' : ''
  }

  let completed: boolean = $state(todo.completed ?? false)

  async function toggleCompleted(): Promise<void> {
    await onUpdateTodo(todo.id, { completed })
  }

  function bgClasses(): string {
    if (todo.completed) return 'bg-success/30 border border-success/40'

    if (todo.type === 'critical' || getDaysUntil(todo.completeUntil) === 'Today')
      return 'bg-error/30 border border-error/40'
    else if (todo.type === 'important' || getDaysUntil(todo.completeUntil) === 'Tomorrow')
      return 'bg-warning/30 border border-warning/40'
    else return 'bg-accent/20 border border-accent/30'
  }

  const customMarked = new Marked({
    async: false,
    renderer: {
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens)
        const titleAttr = title ? ` title="${title}"` : ''

        return `<a href="${href}"${titleAttr} class="link" target="_blank" rel="noopener noreferrer">${text}</a>`
      }
    }
  })

  customMarked.use({
    extensions: [secretAreaExtension]
  })

  function handleSecretClick(event: MouseEvent): boolean {
    const target = event.target as HTMLElement;
    const secret = target.closest('[data-secret]') as HTMLElement | null;

    if (!secret) return false;

    secret.classList.toggle('blur-sm');
    secret.classList.toggle('blur-none');

    return true;
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
      return;
    }

    secret = !secret
  }

  let renderedDescription = $derived(todo.description ? customMarked.parse(todo.description) : '')
  let secret: boolean = $derived(todo.secret)
</script>

<section
  class="flex flex-col {bgClasses()} duration-250 transition-colors px-3 py-2 rounded-md w-full h-full"
  data-menu-type
  data-id={todo.id}
>
  <label class="flex flex-row gap-3 w-full items-center justify-between">
    <div class="flex flex-row gap-3 items-center">
      <input
        type="checkbox"
        class="checkbox checkbox-sm checkbox-ghost"
        bind:checked={completed}
        onchange={() => toggleCompleted()}
      />
      <span class="font-semibold cursor-pointer {completedTextClasses()}">{todo.title}</span>
    </div>

    <div class="flex flex-row gap-3 items-center pe-4">
      {#if todo.completeUntil}
        <span class="badge-sm bg-black/20 px-2 py-0.5 rounded-md">
          {getDaysUntil(todo.completeUntil)}
        </span>
      {/if}

      {#if todo.pinned}
        <Pin size={14} class="opacity-70" />
      {/if}
    </div>
  </label>

  {#if todo.description}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="flex flex-row gap-3 w-full items-center overflow-scroll no-scrollbar w-full h-full"
      onclick={(e) => toggleSecret(e)}
    >
      <input type="checkbox" readonly class="checkbox checkbox-sm checkbox-ghost invisible" />
      <p
        class="markdown opacity-90 {completedTextClasses()} duration-200 transition-all w-full h-full
              {todo.secret ? 'hover:cursor-pointer' : ''} {secret ? 'blur-xs' : ''}"
      >
        {@html renderedDescription}
      </p>
    </div>
  {/if}
</section>
