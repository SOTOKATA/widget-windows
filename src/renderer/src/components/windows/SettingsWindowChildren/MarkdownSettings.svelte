<script lang="ts">
  import type { Settings } from '@app-types/Settings'
  import Input from '../../Input.svelte'
  import MarkdownRenderer from '../../MarkdownRenderer.svelte'

  interface Props {
    settings: Settings
  }

  let { settings = $bindable() }: Props = $props()

  const mdContent = `# Header 1
# Header 2
## Header 3
### Header 4
### Header 5
#### Header 6

paragraph`
</script>

<div class="w-full flex-1 flex flex-col gap-3">
  <div class="flex flex-col">
    <h1 class="">Markdown Settings</h1>
    <span class="text-sm opacity-70">Provides custom classes for basic markdown elements</span>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
    <div class="flex flex-col gap-1.5">
      {#each Object.keys(settings.markdownSettings) as setting (setting)}
        <Input
          id="mds-{setting}"
          label={setting}
          inlineLabel
          type="text"
          placeholder="Empty classes..."
          bind:value={settings.markdownSettings[setting]}
        />
      {/each}
    </div>

    <MarkdownRenderer content={mdContent} customMarkdownPreferences={settings.markdownSettings} />
  </div>
</div>
