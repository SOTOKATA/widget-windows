<script lang="ts">
  import { onMount } from 'svelte'

  let todoId = $state('')
  let title = $state('')
  let isProcess = $state(false)

  onMount(async () => {
    const data = await window.api.todoModal.getData()
    const todo = (await window.api.todos.getAll()).find((item) => item.id === data.todoId)
    if (!todo) return window.api.todoModal.close()

    todoId = todo.id
    title = todo.title
  })

  async function deleteTodo(): Promise<void> {
    if (!todoId || isProcess) return

    isProcess = true
    await window.api.todos.remove(todoId)
    await window.api.todoModal.close()
  }
</script>

<main class="min-h-screen bg-base-200 p-5">
  <div class="flex flex-col gap-4">
    <h1 class="text-lg font-bold">Delete Todo</h1>
    <div class="alert alert-warning"><span>Are you sure you want to delete “{title}”?</span></div>
    <div class="flex justify-end gap-3">
      <button class="btn btn-sm btn-error" onclick={() => void deleteTodo()} disabled={isProcess}>Delete</button>
      <button class="btn btn-sm btn-ghost" onclick={() => window.api.todoModal.close()}>Cancel</button>
    </div>
  </div>
</main>
