<script lang="ts">
  import type { Settings } from '@app-types/Settings'
  import MarkdownSettingItem from './MarkdownSettingItem.svelte'
  import {
    headingData,
    listData,
    otherData,
    type MarkdownSettingItemData
  } from './markdownSettingsData'

  interface Props {
    settings: Settings
  }

  let { settings = $bindable() }: Props = $props()

  const tabs = [
    { label: 'Headers', value: 'header' },
    { label: 'List', value: 'list' },
    { label: 'Other', value: 'other' }
  ]

  let selectedTab: string = $state(tabs[0].value)

  function getCurrentData(): MarkdownSettingItemData | undefined {
    if (selectedTab === 'header') return headingData
    else if (selectedTab === 'list') return listData
    else if (selectedTab === 'other') return otherData

    return undefined
  }
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
          class="btn btn-sm rounded-b-none border-none {selectedTab === tab.value
            ? 'btn-primary'
            : 'bg-base-100'}"
          onclick={() => (selectedTab = tab.value)}
        >
          {tab.label}
        </button>
      {/each}
    </div>

    <hr class="text-primary opacity-70" />
  </div>

  {#if selectedTab}
    <MarkdownSettingItem
      bind:settings
      range={getCurrentData().range}
      markdownPreview={getCurrentData().markdownPreview}
    />
  {/if}
</div>
