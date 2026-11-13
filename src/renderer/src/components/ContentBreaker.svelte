<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    children: Snippet
    sizeY?: number
  }

  let { children, sizeY = 200 }: Props = $props()

  let isOpen: boolean = $state(false)
  let contentElement = $state<HTMLDivElement | null>(null)

  let hasOverflow = $derived(contentElement ? contentElement.scrollHeight > sizeY : false)
</script>

<section class="flex flex-col gap-3">
  <div
    style={isOpen ? '' : `max-height: ${sizeY}px;`}
    bind:this={contentElement}
    class="overflow-y-hidden"
  >
    {@render children()}
  </div>

  {#if hasOverflow}
    <button class="link flex flex-row" onclick={() => (isOpen = !isOpen)}>
      {isOpen ? 'Hide' : 'See more...'}
    </button>
  {/if}
</section>
