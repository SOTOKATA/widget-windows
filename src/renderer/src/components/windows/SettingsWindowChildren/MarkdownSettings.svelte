<script lang="ts">
  import type { Settings } from '@app-types/Settings'
  import MarkdownSettingItem from "./MarkdownSettingItem.svelte";
  import tab from "daisyui/components/tab";

  interface Props {
    settings: Settings
  }

  let { settings = $bindable() }: Props = $props()

  const headingContent = `# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6`

  const list = `1. Ordered item
2. Ordered item

- Unordered item
- Unordered item`

  const other = `> Blockquote example

| Place      | Time  | Number of people |
| ---------- | ----- | ---------------- |
| Restaurant | 14:00 | 3                |
| Park       | 16:00 | 4                |

Paragraph example.`

  const tabs = [
    { label: 'Headers', value: 'header' },
    { label: 'List', value: 'list' },
    { label: 'Other', value: 'other' }
  ]

  let selectedTab: string = $state(tabs[0].value);
</script>

<div class="w-full flex-1 flex flex-col gap-3">
  <div class="flex flex-col">
    <h1 class="">Markdown Settings</h1>
    <span class="text-sm opacity-70">Provides custom classes for basic markdown elements</span>
  </div>

  <div class="flex flex-col">
    <div class="flex flex-row">
      {#each tabs as tab (tab.value)}
        <button
          class="btn btn-sm rounded-b-none border-none {selectedTab === tab.value ? 'btn-primary' : 'bg-base-100'}"
          onclick={() => (selectedTab = tab.value)}
        >
          {tab.label}
        </button>
      {/each}
    </div>

    <hr class="text-primary opacity-70">
  </div>

  {#if selectedTab === 'header'}
    <MarkdownSettingItem
      bind:settings
      range={['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}
      markdownPreview={headingContent}
    />
  {:else if selectedTab === 'list'}
    <MarkdownSettingItem
      bind:settings
      range={['ol', 'ul', 'li']}
      markdownPreview={list}
    />
  {:else if selectedTab === 'other'}
    <MarkdownSettingItem
      bind:settings
      range={['blockquote', 'table', 'p']}
      markdownPreview={other}
    />
  {/if}
</div>
