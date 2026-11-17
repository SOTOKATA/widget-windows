<script lang="ts">
  import type { Settings } from '@app-types/Settings'
  import MarkdownRenderer from '../../MarkdownRenderer.svelte'
  import Input from '../../Input.svelte'
  import { createMarkdownSettings } from '@app-types/MarkdownSettings'
  import { RefreshCw } from '@lucide/svelte'

  interface Props {
    settings: Settings
    range: string[]
    markdownPreview: string
  }

  let { settings = $bindable(), range, markdownPreview }: Props = $props()

  function restoreDefaults(): void {
    const initialSettings = createMarkdownSettings()

    Object.keys(settings.markdownSettings)
      .filter((s) => range.includes(s))
      .forEach((s) => {
        settings.markdownSettings[s] = initialSettings[s]
      })
  }
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
  <div class="flex flex-col border rounded-md shadow-sm border-gray-500 px-3 relative">
    <div class="absolute right-2 top-1 z-10">
      <button class="btn-ghost btn-xs btn-circle btn" onclick={() => restoreDefaults()}>
        <RefreshCw size={14} />
      </button>
    </div>

    {#each range as setting (setting)}
      <Input
        id="mds-{setting}"
        label={setting}
        inlineLabel
        type="text"
        placeholder="Empty classes..."
        class="border-none shadow-none p-0 m-0"
        bind:value={settings.markdownSettings[setting]}
      />
    {/each}
  </div>

  <MarkdownRenderer
    content={markdownPreview}
    customMarkdownPreferences={settings.markdownSettings}
  />
</div>
