<script lang="ts">
  import Input from '../Input.svelte'
  import Select from '../Select.svelte'
  import { createTodo, type TodoType, TodoTypes } from '../../typescript/Todo'

  let isProcess = $state(false)
  let title = $state('')
  let description = $state('')
  let completeUntil = $state('')
  let type: TodoType = $state('neutral')

  async function addTodo(): Promise<void> {
    if (!title.trim() || new Date(completeUntil) < new Date() || isProcess) return

    isProcess = true

    let todo = createTodo({ title: title.trim(), description: description.trim(), type, completeUntil });

    await window.api.todos.create(todo)

    await window.localTodoAPI.set(todo)

    await window.api.todoModal.close()
  }
</script>

<main class="min-h-screen bg-base-200 p-5 h-full">
  <form
    class="flex flex-col gap-3 h-full"
    onsubmit={(event) => {
      event.preventDefault()
      void addTodo()
    }}
  >
    <h1 class="text-lg font-bold">Add Todo</h1>
    <div>
      <Input label="Title" id="title" type="text" bind:value={title} noWidget />
    </div>
    <Input
      label="Description"
      id="description"
      type="textarea"
      bind:value={description}
      noWidget
      class="resize-none! min-h-0 flex-1 flex flex-col [&>textarea]:h-full [&>textarea]:flex-1 code whitespace-pre overflow-x-auto"
    />
    <div>
      <Input
        label="Complete until"
        id="complete_until"
        type="datetime-local"
        min={new Date().toISOString()}
        bind:value={completeUntil}
        noWidget
      />
    </div>

    <div>
      <Select
        label="Type"
        id="type"
        collection={TodoTypes}
        getValue={(item) => item.value}
        getLabel={(item) => item.label}
        bind:value={type}
      />
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <button class="btn btn-sm btn-primary" disabled={isProcess}>Add</button>
      <button
        class="btn btn-sm btn-ghost"
        type="button"
        onclick={() => window.api.todoModal.close()}>Cancel</button
      >
    </div>
  </form>
</main>
