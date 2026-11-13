<script lang="ts">
  import type { Snippet } from 'svelte'
  import { createTodo, type Todo } from "../typescript/Todo";

  interface Props {
    children: Snippet
    todo: Todo
    sizeY?: number
  }

  let { children, sizeY = 200, todo = $bindable() }: Props = $props()

  let isOpen = $derived(todo.alwaysOpen)
  let contentElement = $state<HTMLDivElement | null>(null)
  let hasOverflow = $state(false)

  $effect(() => {
    if (contentElement) {
      const updateOverflow = () => {
        hasOverflow = contentElement!.scrollHeight > sizeY
      }

      updateOverflow()

      const observer = new ResizeObserver(updateOverflow)
      observer.observe(contentElement)

      return () => observer.disconnect()
    }
  })

  async function updateOpen(): Promise<void> {
    isOpen = !isOpen
    todo.alwaysOpen = isOpen
    await window.localTodoAPI.set(createTodo(todo))
  }
</script>

<section class="flex flex-col gap-2">
  <div
    bind:this={contentElement}
    style="max-height: {isOpen ? (contentElement ? `${contentElement.scrollHeight}px` : 'none') : `${sizeY}px`};"
    class="overflow-hidden transition-all duration-300 ease-in-out"
  >
    {@render children()}
  </div>

  {#if hasOverflow}
    <button
      class="link flex flex-row cursor-pointer w-fit text-sm font-medium"
      onclick={() => updateOpen()}
    >
      {isOpen ? 'Hide' : 'Show more...'}
    </button>
  {/if}
</section>
