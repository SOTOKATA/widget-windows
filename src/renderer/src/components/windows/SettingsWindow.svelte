<script lang="ts">
  import { onMount } from 'svelte'
  import type { Settings } from '../../typescript/Settings'
  import Select from '../Select.svelte'
  import { refreshSettings } from '../../typescript/globals.svelte'

  const defaults: Settings = {
    autoLaunch: false,
    bgTransparency: 90
  }
  let settings = $state<Settings>(defaults)
  let status = $state('')

  const transparencies = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

  onMount(async () => {
    settings = await window.settingsAPI.get()
  })

  async function saveSettings(): Promise<void> {
    status = ''
    try {
      const saved = await window.settingsAPI.save({
        autoLaunch: settings.autoLaunch,
        bgTransparency: settings.bgTransparency
      })

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

<main class="w-full h-full bg-base-100 p-4">
  <form
    class="flex flex-col gap-3"
    onsubmit={(event) => {
      event.preventDefault()
      saveSettings()
    }}
  >
    <h1 class="text-center text-lg font-bold">Todo Settings</h1>

    <label class="label cursor-pointer justify-start gap-3">
      <input class="toggle toggle-primary" type="checkbox" bind:checked={settings.autoLaunch} />
      <span class="label-text">Start with Windows</span>
    </label>

    <Select
      label="Background Transparency"
      id="bg-transparency"
      bind:value={settings.bgTransparency}
      collection={transparencies}
      getValue={(p) => p}
      getLabel={(p) => `${p}%`}
    />

    {#if status}<p
        class="text-sm"
        class:text-success={status === 'Settings applied.'}
        class:text-error={status !== 'Settings applied.'}
      >
        {status}
      </p>{/if}
    <div class="flex justify-end gap-2">
      <button class="btn btn-sm btn-primary" type="submit">Save</button><button
        class="btn btn-sm btn-ghost"
        type="button"
        onclick={() => window.close()}>Close</button
      >
    </div>
  </form>
</main>
