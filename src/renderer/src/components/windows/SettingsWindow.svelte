<script lang="ts">
  import { onMount } from 'svelte'
  import type { Settings } from '../../typescript/Settings'

  const defaults: Settings = { autoLaunch: false, position: 'right', height: 'medium', width: 'normal' }
  let settings = $state<Settings>(defaults)
  let status = $state('')

  onMount(async () => {
    settings = await window.api.settings.get()
  })

  async function saveSettings(): Promise<void> {
    status = ''
    try {
      const saved = await window.api.settings.save({
        autoLaunch: settings.autoLaunch,
        position: settings.position,
        height: settings.height,
        width: settings.width
      })

      if (saved)
        window.close();

      status = saved ? 'Settings applied.' : 'Unable to save settings.'
    } catch (error) {
      console.error('Unable to save settings:', error)
      status = 'Unable to save settings.'
    }
  }
</script>

<main class="w-full h-full bg-base-100 p-4">
  <form class="flex flex-col gap-3" onsubmit={(event) => { event.preventDefault(); saveSettings() }}>
    <label class="label cursor-pointer justify-start gap-3">
      <input class="toggle toggle-primary" type="checkbox" bind:checked={settings.autoLaunch} />
      <span class="label-text">Start with Windows</span>
    </label>

    <label class="form-control"><span class="label-text mb-1">Position</span>
      <select class="select select-sm" bind:value={settings.position}>
        <option value="left">Left</option><option value="right">Right</option>
      </select>
    </label>
    <label class="form-control"><span class="label-text mb-1">Height</span>
      <select class="select select-sm" bind:value={settings.height}>
        <option value="small">Small</option><option value="medium">Medium</option><option value="full">Auto (full height)</option>
      </select>
    </label>
    <label class="form-control"><span class="label-text mb-1">Width</span>
      <select class="select select-sm" bind:value={settings.width}>
        <option value="small">Small</option><option value="normal">Normal (default)</option><option value="large">Large</option>
      </select>
    </label>
    {#if status}<p class="text-sm" class:text-success={status === 'Settings applied.'} class:text-error={status !== 'Settings applied.'}>{status}</p>{/if}
    <div class="flex justify-end gap-2"><button class="btn btn-sm btn-primary" type="submit">Save</button><button class="btn btn-sm btn-ghost" type="button" onclick={() => window.close()}>Close</button></div>
  </form>
</main>
