<script lang="ts">
  import Checkbox from '../../Checkbox.svelte'
  import { Play } from '@lucide/svelte'
  import type { Settings } from "@app-types/Settings";

  interface Props {
    settings: Settings
  }

  let {
    settings = $bindable()
  }: Props = $props()

  const transparencies = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
</script>

<div class="w-full flex-1 flex flex-col">
  <div class="flex flex-col gap-3 justify-between flex-1">
    <div class="flex flex-row justify-center">
      <div class="h-full flex flex-col gap-3 w-md">
        <div>
          <Checkbox
            icon={Play}
            id="auto-launch"
            label="Start with Windows"
            bind:value={settings.autoLaunch}
          />
        </div>

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
      </div>
    </div>
  </div>
</div>
