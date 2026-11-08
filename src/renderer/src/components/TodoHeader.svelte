<script lang="ts">
  import type { Todo } from "../typescript/Todo";
  import { Plus, RefreshCw } from '@lucide/svelte'

  interface Props {
    todos: Todo[];
    addTodoModal: HTMLDialogElement | undefined;
    onSync: () => Promise<void>;
  }

  let {
    todos,
    addTodoModal,
    onSync
  }: Props = $props();
</script>

<section class="w-full flex flex-row gap-3 justify-between flex-wrap items-center">
  <div class="flex flex-row gap-3 flex-wrap items-center">
    <div class="font-bold text-lg">Todo</div>
    <div class="opacity-70">{todos.length}</div>
  </div>
  <button class="btn btn-sm btn-circle btn-ghost"
    onclick={() => addTodoModal?.showModal()}
  >
    <Plus size={16} />
  </button>
  <button class="btn btn-sm btn-circle btn-ghost" onclick={() => onSync()} aria-label="Sync todos">
    <RefreshCw size={16} />
  </button>
</section>

<hr class="opacity-70">
