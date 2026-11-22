<script lang="ts">
  import Checkbox from '../../Checkbox.svelte'
  import { Play, Square } from '@lucide/svelte'
  import type { Settings } from '@app-types/Settings'
  import { bgTransparencies, borderTransparencies } from '../todoWindowUtils'
  import { globals } from '../../../typescript/globals.svelte'
  import Select from '../../Select.svelte'

  interface Props {
    settings: Settings
  }

  let { settings = $bindable() }: Props = $props()

  const transparencies = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  const gridSizes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]

  let bgTransparency: string = $derived(bgTransparencies[settings.bgTransparency])
  let borderTransparency: string = $derived(
    settings.removeBorder
      ? ''
      : `rounded-md border ${borderTransparencies[settings.bgTransparency]}`
  )
</script>

<div class="w-full flex-1 flex flex-col">
  <div class="flex flex-col gap-3 justify-between items-center flex-1">
    <div class="flex flex-col gap-6 w-full">
      <div class="flex flex-col gap-3">
        <div class="flex flex-col">
          <h2 class="text-balance">App View</h2>
          <p class="opacity-70 text-sm">Provides window customization, native options</p>
        </div>

        <div class="h-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="flex flex-col gap-3">
            <Checkbox
              icon={Square}
              id="remove-border"
              label="Remove Border"
              bind:value={settings.removeBorder}
            />

            <div class="flex flex-col gap-1">
              <label class="label text-sm">Transparency</label>
              <div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  class="range range-xs range-primary w-full"
                  step="10"
                  bind:value={settings.bgTransparency}
                />
                <div class="flex justify-between mt-1 px-0.5 text-xs">
                  {#each transparencies as transparency}
                <span
                  class="
                {transparency === 0
                    ? 'text-left'
                    : transparency === 100
                      ? 'text-right'
                      : 'text-center'}
                {transparency === settings.bgTransparency ? 'text-primary' : ''}
                duration-300 transition-colors
                "
                >
                  {transparency}%
                </span>
                  {/each}
                </div>
              </div>
            </div>

            <Checkbox
              icon={Play}
              id="auto-launch"
              label="Start with Windows"
              bind:value={settings.autoLaunch}
            />
          </div>

          <div class="relative bg-white h-full flex flex-col min-h-24 border-0 rounded-md p-1">
            <div class="flex-1 {bgTransparency} {borderTransparency} flex flex-col justify-center items-center">
              <div class="text-black opacity-60 text-xs">Window Preview</div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <div class="flex flex-col">
          <h2 class="text-balance">Grid Settings</h2>
          <p class="opacity-70 text-sm">Provides grid settings in full mode</p>
        </div>

        <div class="h-full grid grid-cols-2 gap-3">
          <Select
            id="grid-width"
            label="Width"
            inlineLabel
            collection={gridSizes}
            bind:value={settings.gridWidth}
            getValue={(i) => i}
            getLabel={(i) => i.toString()}
          />

          <Select
            id="grid-height"
            label="Height"
            inlineLabel
            collection={gridSizes}
            bind:value={settings.gridHeight}
            getValue={(i) => i}
            getLabel={(i) => i.toString()}
          />
        </div>
      </div>
    </div>
  </div>
</div>
