<script lang="ts">
  import Modal from "./Modal.svelte";
  import Input from "../Input.svelte";
  import { createTodo, type Todo, type TodoType, TodoTypes } from "../../typescript/Todo";
  import Select from "../Select.svelte";

  interface Props {
    modal: HTMLDialogElement | undefined;
    onAddTodo: (todo: Todo) => void;
  }

  async function addTodo(): Promise<void> {
    if (!title.trim()) return;
    if (new Date(completeUntil) < new Date()) return;
    if (isProcess) return;

    isProcess = true;

    const todo = createTodo({
      title: title.trim(),
      description: description.trim(),
      type,
      completeUntil
    });

    await window.api.todos.create(todo);
    modal?.close();
    onAddTodo(todo);
    title = '';
    description = '';
    type = 'neutral';
    completeUntil = '';

    isProcess = false;
  }

  let isProcess: boolean = $state(false);

  let title: string = $state('');
  let description: string = $state('');
  let completeUntil: string = $state('');
  let type: TodoType = $state();

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

    <Input
      label="Complete until"
      id="complete_until"
      type="datetime-local"
      min={new Date().toISOString()}
      bind:value={completeUntil}
    />

    <Select
      label="Type"
      id="type"
      collection={TodoTypes}
      getValue={(t) => t.value}
      getLabel={(t) => t.label}
      bind:value={type}
    />
  </form>

  {#snippet footer()}
    <button class="btn btn-xs btn-primary" onclick={() => addTodo()} disabled={isProcess}>
      Add
    </button>

    <button class="btn btn-xs btn-ghost btn-neutral"
      onclick={() => modal?.close()}
    >
      Close
    </button>
  {/snippet}
</Modal>
