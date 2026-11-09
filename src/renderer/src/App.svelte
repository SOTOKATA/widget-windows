<script lang="ts">
  import TodoWindow from "./components/windows/TodoWindow.svelte";
  import SettingsWindow from "./components/windows/SettingsWindow.svelte";
  import AddTodoModal from './components/modal/AddTodoModal.svelte'
  import ChangeTodoModal from './components/modal/ChangeTodoModal.svelte'
  import DeleteTodoModal from './components/modal/DeleteTodoModal.svelte'

  let currentRoute = $state(window.location.hash);

  window.addEventListener('hashchange', () => {
    currentRoute = window.location.hash;
  });
</script>

{#if currentRoute === '#/settings'}
  <SettingsWindow />
{:else if currentRoute === '#/todo-modal/add'}
  <AddTodoModal />
{:else if currentRoute === '#/todo-modal/change'}
  <ChangeTodoModal />
{:else if currentRoute === '#/todo-modal/delete'}
  <DeleteTodoModal />
{:else}
  <TodoWindow />
{/if}
