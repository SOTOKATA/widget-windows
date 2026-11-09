<script lang="ts">
  import { onMount } from 'svelte'
  import type { Settings } from '../../typescript/Settings'
  import Select from "../Select.svelte";

  const defaults: Settings = { autoLaunch: false, position: 'right', height: 'medium', width: 'normal' }
  let settings = $state<Settings>(defaults)
  let status = $state('')

  const positions = [
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' }
  ]

  const heights = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Auto (Full height)', value: 'full' }
  ]

  const widths = [
    { label: 'Small', value: 'small' },
    { label: 'Normal (default)', value: 'normal' },
    { label: 'Large', value: 'large' },
  ]

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
    <h1 class="text-center text-lg font-bold">Todo Settings</h1>

    <label class="label cursor-pointer justify-start gap-3">
      <input class="toggle toggle-primary" type="checkbox" bind:checked={settings.autoLaunch} />
      <span class="label-text">Start with Windows</span>
    </label>

    <Select
      label="Position"
      id="position"
      collection={positions}
      getValue={(p) => p.value}
      getLabel={(p) => p.label}
      bind:value={settings.position}
    />

    <Select
      label="Height"
      id="height"
      collection={heights}
      getValue={(p) => p.value}
      getLabel={(p) => p.label}
      bind:value={settings.height}
    />

    <Select
      label="Width"
      id="width"
      collection={widths}
      getValue={(p) => p.value}
      getLabel={(p) => p.label}
      bind:value={settings.width}
    />

    {#if status}<p class="text-sm" class:text-success={status === 'Settings applied.'} class:text-error={status !== 'Settings applied.'}>{status}</p>{/if}
    <div class="flex justify-end gap-2"><button class="btn btn-sm btn-primary" type="submit">Save</button><button class="btn btn-sm btn-ghost" type="button" onclick={() => window.close()}>Close</button></div>
  </form>
</main>
