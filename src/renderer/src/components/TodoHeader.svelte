<script lang="ts">
  import { RefreshCw } from '@lucide/svelte'
  import type { Todo } from '@app-types/Todo'

  interface Props {
    todos: Todo[]
    onSync: () => Promise<void>
  }

  let { todos, onSync }: Props = $props()

  let isSync: boolean = $state(false)
  async function syncTodos(): Promise<void> {
    isSync = true
    await onSync()
    isSync = false
  }
</script>

<section
  class="w-full flex flex-row gap-3 md:px-3 py-1 justify-between flex-wrap items-center drag">
  <div class="flex flex-row gap-3 items-center">
    <div class="font-bold text-lg">
      <a href="https://github.com/SOTOKATA" target="_blank" class="font-mono link">@sotok</a>
      Todos
    </div>
  </div>

  <div class="opacity-70 font-mono">({todos.length})</div>

  <div class="flex flex-row gap-3 items-center">
    <button
      class="btn btn-xs btn-neutral opacity-70 font-mono"
      onclick={() => window.devToolsAPI.openConsole()}
    >
      dev
    </button>

    <button
      class="btn btn-sm btn-ghost {isSync ? 'pointer-events-none' : 'btn-circle'}"
      onclick={() => syncTodos()}
      disabled={isSync}
      aria-label="Sync todos"
    >
      {#if isSync}
        <span class="loading loading-xs loading-spinnet"></span> Syncing
      {:else}
        <RefreshCw size={16} />
      {/if}
    </button>
  </div>
</section>

<div class="flex md:hidden">
  <hr class="opacity-70 w-full" />
</div>

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

  a {
    -webkit-app-region: no-drag;
    app-region: no-drag;
  }
</style>
