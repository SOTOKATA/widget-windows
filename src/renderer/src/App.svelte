<script lang="ts">
  import TodoWindow from "./components/windows/TodoWindow.svelte";
  import SettingsWindow from "./components/windows/SettingsWindow.svelte";

  let currentRoute = $state(window.location.hash);

  window.addEventListener('hashchange', () => {
    currentRoute = window.location.hash;
  });
</script>

{#if currentRoute === '#/settings'}
  <SettingsWindow />
{:else}
  <TodoWindow />
{/if}
