<script lang="ts">
  import { onMount } from 'svelte'
  import Alert from "../Alert.svelte";

  let todoId = $state('')
  let title = $state('')
  let isProcess = $state(false)

  onMount(async () => {
    const data = await window.todoModalAPI.getData()
    const todo = (await window.todoAPI.getAll()).find((item) => item.id === data.todoId)
    if (!todo) return window.todoModalAPI.close()

    todoId = todo.id
    title = todo.title
  })

  async function deleteTodo(): Promise<void> {
    if (!todoId || isProcess) return

    isProcess = true
    await window.todoAPI.remove(todoId)
    await window.localTodoStorageAPI.delete(todoId)
    await window.todoModalAPI.close()
  }
</script>

<main class="min-h-screen bg-base-200 p-5">
  <div class="flex flex-col gap-4">
    <h1 class="text-lg font-bold">Delete Todo</h1>
    <Alert type="warning">
      Are you sure you want to delete "{title}"?
    </Alert>
    <div class="flex justify-end gap-3">
      <button class="btn btn-xs btn-error" onclick={() => void deleteTodo()} disabled={isProcess}>Delete</button>
      <button class="btn btn-xs btn-ghost" onclick={() => window.todoModalAPI.close()}>Cancel</button>
    </div>
  </div>
</main>
