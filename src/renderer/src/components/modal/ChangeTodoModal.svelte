<script lang="ts">
  import Input from '../Input.svelte'
  import type { Todo } from '../../typescript/Todo'
  import Modal from './Modal.svelte'

  interface Props {
    todo?: Todo
    modal?: HTMLDialogElement | undefined
    onChangeTodo: (id: string, data: Pick<Todo, 'title' | 'description'>) => Promise<void>
  }

  let { todo, modal = $bindable(), onChangeTodo }: Props = $props()
  let title = $state('')
  let description = $state('')

  async function changeTodo(): Promise<void> {
    if (!todo || !title.trim()) return

    await onChangeTodo(todo.id, { title: title.trim(), description: description.trim() })
    modal?.close()
  }

  export function openModal(): void {
    title = todo?.title ?? ''
    description = todo?.description ?? ''
    modal?.showModal()
  }
</script>

<Modal id="change-todo-modal" title="Change Todo" bind:self={modal}>
  <form class="flex flex-col gap-1.5" onsubmit={(event) => { event.preventDefault(); changeTodo() }}>
    <Input label="Title" id="change-title" type="text" bind:value={title} />
    <Input label="Description" id="change-description" type="textarea" bind:value={description} />
  </form>

  {#snippet footer()}
    <button class="btn btn-xs btn-primary" onclick={changeTodo}>Save</button>
    <button class="btn btn-xs btn-ghost btn-neutral" onclick={() => modal?.close()}>Cancel</button>
  {/snippet}
</Modal>
