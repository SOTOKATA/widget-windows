<script lang="ts">
  import Input from '../Input.svelte'
  import { type Todo, type TodoType, TodoTypes } from "../../typescript/Todo";
  import Modal from './Modal.svelte'
  import Select from "../Select.svelte";

  interface Props {
    todo?: Todo
    modal?: HTMLDialogElement | undefined
    onChangeTodo: (id: string, data: Pick<Todo, 'title' | 'description' | 'completeUntil' | 'type'>) => Promise<void>
  }

  let { todo, modal = $bindable(), onChangeTodo }: Props = $props()
  let title = $state('')
  let description = $state('')
  let completeUntil: string = $state('')
  let type: TodoType = $state()

  let isProcess: boolean = $state(false);

  async function changeTodo(): Promise<void> {
    if (!todo || !title.trim()) return
    if (new Date(completeUntil) < new Date()) return;
    if (isProcess) return;

    isProcess = true;

    await onChangeTodo(todo.id, {
      title: title.trim(),
      description: description.trim(),
      completeUntil,
      type
    })
    modal?.close()

    isProcess = false;
  }

  export function openModal(): void {
    title = todo?.title ?? ''
    description = todo?.description ?? ''
    completeUntil = todo?.completeUntil ?? ''
    type = todo?.type ?? 'neutral'
    modal?.showModal()
  }
</script>

<Modal id="change-todo-modal" title="Change Todo" bind:self={modal}>
  <form class="flex flex-col gap-1.5" onsubmit={(event) => { event.preventDefault(); changeTodo() }}>
    <Input label="Title" id="change-title" type="text" bind:value={title} />
    <Input label="Description" id="change-description" type="textarea" bind:value={description} />

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
    <button class="btn btn-xs btn-primary" onclick={changeTodo} disabled={isProcess}>Save</button>
    <button class="btn btn-xs btn-ghost btn-neutral" onclick={() => modal?.close()}>Cancel</button>
  {/snippet}
</Modal>
