<script lang="ts">
  import Input from '../Input.svelte'
  import Select from '../Select.svelte'
  import { type TodoType, createTodo, TodoTypes } from '@app-types/Todo'
  import { localTodoFromTodo } from '@app-types/LocalTodo'
  import Checkbox from '../Checkbox.svelte'
  import { KeyRound } from '@lucide/svelte'
  import MarkdownRenderer from '../MarkdownRenderer.svelte'
  import WindowMockup from '../windows/WindowMockup.svelte'
  import ButtonSelect from '../ButtonSelect.svelte'
  import { todoColors } from '../../typescript/todoColors'

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

    await window.todoAPI.create(todo)

    await window.localTodoStorageAPI.set(localTodoFromTodo(todo))

    await window.todoModalAPI.close()
  }

  const placeholderDescription: string = `- Milk 1L
- Bread
- Eggs (12)`

  function relativeTypeButtonClass(itemType): string {
    if (type !== itemType) return ''

    function getColors(itemType: string): string | undefined {
      if (itemType === 'neutral') return todoColors.normal
      else if (itemType === 'important') return todoColors.important
      else if (itemType === 'critical') return todoColors.critical
      else return undefined
    }

    const colors = getColors(itemType)
    return colors ? `${colors} shadow-none` : ''
  }
</script>

<WindowMockup title="Add Todo" classHeader="bg-base-100!" classContent="bg-base-100!">
  <div class=" flex-1 p-3 md:grid md:grid-cols-2 md:gap-3">
    <form
      class="flex flex-col gap-3 h-full"
      onsubmit={(event) => {
        event.preventDefault()
        void addTodo()
      }}
    >
      <div>
        <Input label="Title" id="title" type="text" bind:value={title} placeholder="Product list" />
      </div>
      <Input
        label="Description"
        id="description"
        type="textarea"
        placeholder={placeholderDescription}
        bind:value={description}
        class="resize-none! min-h-0 flex-1 flex flex-col [&>textarea]:h-full [&>textarea]:flex-1 code whitespace-pre overflow-x-auto"
      />
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
          getButtonClass={(item) => relativeTypeButtonClass(item.value)}
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
