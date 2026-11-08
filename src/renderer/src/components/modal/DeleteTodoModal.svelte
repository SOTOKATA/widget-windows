<script lang="ts">
  import type { Todo } from "../../typescript/Todo";
  import Modal from "./Modal.svelte";

  interface Props {
    todo?: Todo;
    modal: HTMLDialogElement | undefined;
    onDeleteTodo: (id: string) => void;
  }

  let {
    todo,
    modal = $bindable(),
    onDeleteTodo
  }: Props = $props()

  async function submitForm(): Promise<void> {
    if (!todo)
      return;

    await window.api.todos.remove(todo.id);
    modal?.close();
    onDeleteTodo(todo.id);
  }
</script>

<Modal title="Delete todo" id="delete-todo-modal" bind:self={modal}>
  <div class="flex flex-col gap-3">
    <div class="alert alert-warning" role="alert">
      <span>Are you sure want to delete '{todo?.title}' todo?</span>
    </div>
  </div>

  {#snippet footer()}
    <button class="btn btn-xs btn-error" onclick={() => submitForm()}>
      Delete
    </button>

    <button class="btn btn-xs btn-ghost btn-primary" onclick={() => modal?.close()}>
      Cancel
    </button>
  {/snippet}
</Modal>
