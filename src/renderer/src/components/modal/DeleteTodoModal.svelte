<script lang="ts">
  import { onMount } from 'svelte'
  import Alert from "../Alert.svelte";
  import WindowMockup from "../windows/WindowMockup.svelte";

  let todoId = $state('')
  let title = $state('')
  let isProcess = $state(false)

  onMount(async () => {
    const data = await window.todoModalAPI.getData()
    const todo = (await window.databaseAPI.todoAPI.getAll()).find((item) => item.id === data.todoId)
    if (!todo) return window.todoModalAPI.close()

    todoId = todo.id
    title = todo.title
  })

  async function deleteTodo(): Promise<void> {
    if (!todoId || isProcess) return

    isProcess = true
    await window.databaseAPI.todoAPI.remove(todoId)
    await window.localTodoStorageAPI.delete(todoId)
    await window.todoModalAPI.close()
  }
</script>

<WindowMockup title="Delete Todo" classHeader="bg-base-100!" classContent="bg-base-100!">
  <div class="flex-1 p-3">
    <div class="flex flex-col gap-4">
      <Alert type="warning">
        Are you sure you want to delete "{title}"?
      </Alert>
      <div class="flex justify-end gap-3">
        <button class="btn btn-xs btn-error" onclick={() => void deleteTodo()} disabled={isProcess}>Delete</button>
        <button class="btn btn-xs btn-ghost" onclick={() => window.todoModalAPI.close()}>Cancel</button>
      </div>
    </div>
  </div>
</WindowMockup>
