<script lang="ts">
  import type { Todo } from "../typescript/Todo";
  import { Plus, RefreshCw } from '@lucide/svelte'

  interface Props {
    todos: Todo[];
    onSync: () => Promise<void>;
  }

  let {
    todos,
    onSync
  }: Props = $props();

  let isSync: boolean = $state(false);
  async function syncTodos(): void {
    isSync = true;
    await onSync();
    isSync = false;
  }
</script>

<section class="w-full flex flex-row gap-3 justify-between flex-wrap items-center">
  <div class="flex flex-row gap-1 items-center">
    <div class="font-bold text-lg">Sotok Todo </div>
    <div class="opacity-70">({todos.length})</div>
  </div>
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
</section>

<hr class="opacity-70">
