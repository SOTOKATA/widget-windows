<script lang="ts">
  import Input from '../Input.svelte'
  import { type TodoType, createTodo, TodoTypes } from '@app-types/Todo'
  import { localTodoFromTodo } from '@app-types/LocalTodo'
  import Checkbox from '../Checkbox.svelte'
  import { KeyRound } from '@lucide/svelte'
  import MarkdownRenderer from '../MarkdownRenderer.svelte'
  import WindowMockup from '../windows/WindowMockup.svelte'
  import ButtonSelect from '../ButtonSelect.svelte'
  import { relativeTypeButtonClass } from './utils'
  import MarkdownEditor from "../MarkdownEditor.svelte";

  let isProcess = $state(false)
  let title = $state('')
  let description = $state('')
  let completeUntil = $state('')
  let type: TodoType = $state('neutral')
  let secret: boolean = $state(false)

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

    await window.databaseAPI.todoAPI.create(todo)

    await window.localTodoStorageAPI.set(localTodoFromTodo(todo))

    await window.todoModalAPI.close()
  }

  const placeholderDescription: string = `- Milk 1L
- Bread
- Eggs (12)`
</script>

<WindowMockup title="Add Todo" classHeader="bg-base-100!" classContent="bg-base-100!">
  <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-3 md:grid md:grid-cols-2 md:grid-rows-[minmax(0,1fr)] md:gap-3">
    <form
      class="flex h-full min-h-0 min-w-0 flex-col gap-3 overflow-hidden"
      onsubmit={(event) => {
        event.preventDefault()
        void addTodo()
      }}
    >
      <div>
        <Input label="Title" id="title" type="text" bind:value={title} placeholder="Product list" />
      </div>

      <div class="min-h-0 min-w-0 flex-1 overflow-hidden">
        <MarkdownEditor bind:content={description} />
      </div>

      <div>
        <Input
          label="Complete until"
          id="complete_until"
          type="datetime-local"
          min={new Date().toISOString()}
          bind:value={completeUntil}
        />
      </div>

      <div>
        <ButtonSelect
          label="Type"
          collection={TodoTypes}
          getValue={(item) => item.value}
          getLabel={(item) => item.label}
          getButtonClass={(item) => relativeTypeButtonClass(type, item.value)}
          bind:value={type}
        />
      </div>

      <div>
        <Checkbox label="Secret" icon={KeyRound} id="secret" bind:value={secret} />
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button class="btn btn-sm btn-primary" disabled={isProcess}>Add</button>
        <button
          class="btn btn-sm btn-ghost"
          type="button"
          onclick={() => window.todoModalAPI.close()}>Cancel</button
        >
      </div>
    </form>

    <div class="mockup-window bg-base-200 md:flex hidden">
      <div class="absolute top-3 right-4">
        <div class="badge badge-sm badge-primary rounded-md">Description Preview</div>
      </div>

      <div class="overflow-auto flex-1 min-h-0 h-full px-3">
        <MarkdownRenderer
          content={description.trim().length === 0 ? placeholderDescription : description}
        />
      </div>
    </div>
  </div>
</WindowMockup>
