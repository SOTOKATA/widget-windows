<script lang="ts">
  import Input from '../Input.svelte'
  import Select from '../Select.svelte'
  import { type TodoType, createTodo, TodoTypes } from '@app-types/Todo'
  import { localTodoFromTodo } from '@app-types/LocalTodo'
  import Checkbox from "../Checkbox.svelte";
  import { KeyRound } from "@lucide/svelte";

  let isProcess = $state(false)
  let title = $state('')
  let description = $state('')
  let completeUntil = $state('')
  let type: TodoType = $state('neutral')
  let secret: boolean = $state(false);

  async function addTodo(): Promise<void> {
    if (!title.trim() || new Date(completeUntil) < new Date() || isProcess) return

    isProcess = true

    let todo = createTodo({
      title: title.trim(),
      description: description.trim(),
      type,
      secret,
      completeUntil
    })

    await window.todoAPI.create(todo)

    await window.localTodoStorageAPI.set(localTodoFromTodo(todo))

    await window.todoModalAPI.close()
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

    <div>
      <Checkbox label="Secret" icon={KeyRound} id="secret" bind:value={secret} />
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <button class="btn btn-sm btn-primary" disabled={isProcess}>Add</button>
      <button class="btn btn-sm btn-ghost" type="button" onclick={() => window.todoModalAPI.close()}
        >Cancel</button
      >
    </div>
  </form>
</main>
