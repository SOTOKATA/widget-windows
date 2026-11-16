<script lang="ts">
  import { onMount } from 'svelte'
  import Input from '../Input.svelte'
  import Select from '../Select.svelte'
  import { type TodoType, TodoTypes } from '@app-types/Todo'
  import { KeyRound } from "@lucide/svelte";
  import Checkbox from "../Checkbox.svelte";
  import MarkdownRenderer from "../MarkdownRenderer.svelte";

  let todoId = $state('')
  let isProcess = $state(false)
  let title = $state('')
  let description = $state('')
  let completeUntil = $state('')
  let type: TodoType = $state('neutral')
  let secret: boolean = $state(false)

  onMount(async () => {
    const { todoId: id } = await window.todoModalAPI.getData()
    const todo = (await window.todoAPI.getAll()).find((item) => item.id === id)
    if (!todo) return window.todoModalAPI.close()

    todoId = todo.id
    title = todo.title
    description = todo.description
    completeUntil = todo.complete_until ?? ''
    secret = todo.secret
    type = todo.type as TodoType
  })

  async function changeTodo(): Promise<void> {
    if (!todoId || !title.trim() || new Date(completeUntil) < new Date() || isProcess) return

    isProcess = true
    await window.todoAPI.update(todoId, {
      title: title.trim(),
      description: description.trim(),
      secret,
      completeUntil,
      type
    })
    await window.todoModalAPI.close()
  }

  const placeholderDescription: string = `- Milk 1L
- Bread
- Eggs (12)`;
</script>

<main class="min-h-screen bg-base-100 p-5 h-full w-full md:grid md:grid-cols-2 md:gap-3">
  <form
    class="flex flex-col gap-3 h-full"
    onsubmit={(event) => {
      event.preventDefault()
      void changeTodo()
    }}
  >
    <h1 class="text-lg font-bold">Change Todo</h1>

    <div>
      <Input label="Title" id="title" type="text" bind:value={title} noWidget />
    </div>
    <Input
      label="Description"
      id="description"
      type="textarea"
      bind:value={description}
      noWidget
      class="resize-none! min-h-0 flex-1 flex flex-col [&>textarea]:h-full [&>textarea]:flex-1 code [&>textarea]:bg-base-300 whitespace-pre overflow-x-auto"
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
      <button class="btn btn-sm btn-primary" disabled={isProcess}>Save</button>
      <button class="btn btn-sm btn-ghost" type="button" onclick={() => window.todoModalAPI.close()}
        >Cancel</button
      >
    </div>
  </form>

  <div class="mockup-window bg-base-200 md:flex hidden">
    <div class="absolute top-3 right-4">
      <div class="badge badge-sm badge-primary rounded-md">
        Description Preview
      </div>
    </div>

    <div class="overflow-auto flex-1 min-h-0 h-full px-3">
      <MarkdownRenderer
        content={description}
      />
    </div>
  </div>
</main>
