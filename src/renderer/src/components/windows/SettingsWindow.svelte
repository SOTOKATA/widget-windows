<script lang="ts">
  import AppSettings from './SettingsWindowChildren/AppSettings.svelte'
  import { X } from '@lucide/svelte'
  import { createSettings, type Settings } from '@app-types/Settings'
  import { onMount } from 'svelte'
  import { refreshSettings } from '../../typescript/globals.svelte'
  import MarkdownSettings from './SettingsWindowChildren/MarkdownSettings.svelte'
  import { createMarkdownSettings } from '@app-types/MarkdownSettings'

  const tabs = [
    { label: 'App Settings', value: 'app' },
    { label: 'Markdown Settings', value: 'markdown' }
  ]

  let selectedTab: string = $state(tabs[0].value)

  const defaults: Settings = createSettings()

  let settings = $state<Settings>(defaults)
  let status = $state('')

  onMount(async () => {
    settings = await window.settingsAPI.get()

    if (!settings.markdownSettings) settings.markdownSettings = defaults.markdownSettings
  })

  async function saveSettings(): Promise<void> {
    status = ''
    try {
      const saved = await window.settingsAPI.save(createSettings(settings))

      if (saved) {
        await refreshSettings()
        window.close()
      }

      status = saved ? 'Settings applied.' : 'Unable to save settings.'
    } catch (error) {
      console.error('Unable to save settings:', error)
      status = 'Unable to save settings.'
    }
  }
</script>

<main class="flex flex-col min-h-screen max-h-screen w-full">
  <div
    class="flex flex-row gap-3 justify-between items-center drag bg-base-300 rounded-t-md"
    style="background-image: radial-gradient(currentColor 0.001em, transparent 0.048em); background-size: 6px 6px;"
  >
    <div class="flex flex-row">
      {#each tabs as tab (tab.value)}
        <button
          class="btn no-drag btn-ghost btn-sm rounded-b-none {selectedTab === tab.value
            ? 'bg-primary'
            : 'bg-base-100'}"
          onclick={() => (selectedTab = tab.value)}
        >
          {tab.label}
        </button>
      {/each}
    </div>

    <button class="btn btn-sm btn-circle no-drag btn-ghost" onclick={() => window.close()}>
      <X size={14} />
    </button>
  </div>

  <div
    class="bg-base-200 rounded-b-md border-b-3 overflow-auto border-base-300 flex-1 flex flex-col py-3 gap-1.5"
  >
    <div class="flex-1 px-3 overflow-auto rounded-xl">
      {#if selectedTab === 'app'}
        <AppSettings bind:settings />
      {:else if selectedTab === 'markdown'}
        <MarkdownSettings bind:settings />
      {/if}
    </div>

    <div class="flex flex-row w-full justify-between px-3 items-center">
      <p
        class="text-sm"
        class:text-success={status === 'Settings applied.'}
        class:text-error={status !== 'Settings applied.'}
      >
        {status}
      </p>

      <div class="flex justify-end gap-2">
        <button class="btn btn-xs btn-primary px-6" type="submit" onclick={() => saveSettings()}>
          Save
        </button>
        <button class="btn btn-xs btn-ghost px-4" type="button" onclick={() => window.close()}>
          Close
        </button>
      </div>
    </div>
  </div>
</main>

<style>
  .drag {
    -webkit-app-region: drag;
    app-region: drag;
  }

  .no-drag {
    -webkit-app-region: no-drag;
    app-region: no-drag;
  }
</style>
