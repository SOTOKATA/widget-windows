<script lang="ts">
  import { onMount } from 'svelte'
  import Input from '../Input.svelte'
  import Select from '../Select.svelte'
  import { type TodoType, TodoTypes } from '../../typescript/Todo'

  let todoId = $state('')
  let isProcess = $state(false)
  let title = $state('')
  let description = $state('')
  let completeUntil = $state('')
  let type: TodoType = $state('neutral')

  onMount(async () => {
    const { todoId: id } = await window.api.todoModal.getData()
    const todo = (await window.api.todos.getAll()).find((item) => item.id === id)
    if (!todo) return window.api.todoModal.close()

    todoId = todo.id
    title = todo.title
    description = todo.description
    completeUntil = todo.complete_until ?? ''
    type = todo.type as TodoType
  })

  async function changeTodo(): Promise<void> {
    if (!todoId || !title.trim() || new Date(completeUntil) < new Date() || isProcess) return

    isProcess = true
    await window.api.todos.update(todoId, { title: title.trim(), description: description.trim(), completeUntil, type })
    await window.api.todoModal.close()
  }
</script>

<main class="min-h-screen bg-base-200 p-5">
  <form class="flex flex-col gap-3" onsubmit={(event) => { event.preventDefault(); void changeTodo() }}>
    <h1 class="text-lg font-bold">Change Todo</h1>
    <Input label="Title" id="change-title" type="text" bind:value={title} noWidget />
    <Input label="Description" id="change-description" type="textarea" bind:value={description} noWidget />
    <Input label="Complete until" id="complete_until" type="datetime-local" min={new Date().toISOString()}
           bind:value={completeUntil} noWidget />
    <Select label="Type" id="type" collection={TodoTypes} getValue={(item) => item.value} getLabel={(item) =>
    item.label} bind:value={type} noWidget />
    <div class="flex justify-end gap-3 pt-2">
      <button class="btn btn-sm btn-primary" disabled={isProcess}>Save</button>
      <button class="btn btn-sm btn-ghost" type="button" onclick={() => window.api.todoModal.close()}>Cancel</button>
    </div>
  </form>
</main>
