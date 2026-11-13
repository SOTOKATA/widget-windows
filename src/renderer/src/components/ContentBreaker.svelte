<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    children: Snippet
    sizeY?: number
  }

  let { children, sizeY = 200 }: Props = $props()

  let isOpen = $state(false)
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
      onclick={() => (isOpen = !isOpen)}
    >
      {isOpen ? 'Hide' : 'Show more...'}
    </button>
  {/if}
</section>
