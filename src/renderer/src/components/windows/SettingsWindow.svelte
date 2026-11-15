<script lang="ts">
  import AppSettings from './SettingsWindowChildren/AppSettings.svelte'
  import MarkdownSettings from "./SettingsWindowChildren/MarkdownSettings.svelte";

  const tabs = [
    { label: 'App Settings', value: 'app' },
    { label: 'Markdown Settings', value: 'markdown' }
  ]

  let selectedTab: string = $state(tabs[0].value);
</script>

<main class="flex flex-col gap-3 min-h-screen max-h-screen w-full bg-base-200">
  <div class="w-full flex-col flex">
    <div class="flex flex-row">
      {#each tabs as tab (tab.value)}
        <button class="btn btn-ghost rounded-none" class:bg-primary={selectedTab === tab.value} onclick={() =>
        selectedTab = tab.value}>
          {tab.label}
        </button>
      {/each}
    </div>

    <hr class="w-full opacity-40" />
  </div>

  <div class="flex-1 min-h-0 px-3 overflow-auto">
    {#if selectedTab === 'app'}
      <AppSettings />
    {:else if selectedTab === 'markdown'}
      <MarkdownSettings />
    {/if}
  </div>
</main>
