<script lang="ts">
  import WindowMockup from './WindowMockup.svelte'
  import { onMount } from 'svelte'

  let progress = $state(0)
  let status = $state<'checking' | 'downloading' | 'installing' | 'ready' | 'error'>('checking')

  onMount(() => {
    const offProgress = window.updateAPI.onDownloadStateUpdate((value) => {
      progress = Math.round(value)
    })
    const offState = window.updateAPI.onStateUpdate((value) => {
      status = value
    })

    return () => {
      offProgress()
      offState()
    }
  })
</script>

<WindowMockup
  title="Updating"
  classHeader="bg-base-100!"
  classContent="bg-base-100!"
  canClose={false}
>
  <div class="flex flex-col gap-3">
    <div>
      {#if status === 'checking'}
        Checking for updates...
      {:else if status === 'downloading'}
        Downloading update... {progress}%
      {:else if status === 'installing'}
        Installing update...
      {:else if status === 'error'}
        Could not check for updates. Starting the app...
      {:else}
        Starting the app...
      {/if}
    </div>

    <progress class="progress" value={progress} max="100"></progress>
  </div>
</WindowMockup>
