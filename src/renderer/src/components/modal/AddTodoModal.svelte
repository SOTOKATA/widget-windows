<script lang="ts">
  import Modal from "./Modal.svelte";
  import Input from "../Input.svelte";
  import { createTodo, type Todo } from "../../typescript/Todo";

  interface Props {
    modal: HTMLDialogElement | undefined;
    onAddTodo: (todo: Todo) => void;
  }

  async function addTodo(): Promise<void> {
    if (!title.trim()) return;

    const todo = createTodo({
      title: title.trim(),
      description: description.trim()
    });
    await window.api.todos.create(todo);
    modal?.close();
    onAddTodo(todo);
    title = '';
    description = '';
  }

  let title: string = $state('');
  let description: string = $state('');

  let {
    modal = $bindable(),
    onAddTodo
  }: Props = $props();
</script>

<Modal id="add-todo-modal" title="Add Todo" bind:self={modal}>
  <form action="" class="flex flex-col gap-1.5">
    <Input
      label="Title"
      id="title"
      type="text"
      bind:value={title}
    />

    <Input
      label="Description"
      id="description"
      type="textarea"
      bind:value={description}
    />
  </form>

  {#snippet footer()}
    <button class="btn btn-xs btn-primary" onclick={() => addTodo()}>
      Add
    </button>

    <button class="btn btn-xs btn-ghost btn-neutral"
      onclick={() => modal?.close()}
    >
      Close
    </button>
  {/snippet}
</Modal>
