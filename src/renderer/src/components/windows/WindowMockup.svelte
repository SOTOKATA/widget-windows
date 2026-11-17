<script lang="ts">
  import type { Snippet } from "svelte";
  import { X } from "@lucide/svelte";

  interface Props {
    children: Snippet
    title?: string
    classContent?: string
    classHeader?: string
    classWindow?: string
  }

  let {
    children,
    title = 'Window',
    classHeader = '',
    classWindow = '',
    classContent = ''
  }: Props = $props()
</script>

<main class="flex flex-col min-h-screen max-h-screen w-full {classWindow}">
  <div
    class="flex flex-row gap-3 justify-between items-center drag bg-base-300 rounded-t-md"
    style="background-image: radial-gradient(currentColor 0.001em, transparent 0.048em); background-size: 6px 6px;"
  >
    <div class="bg-base-200 px-3 py-1 rounded-s-md rounded-b-none {classHeader}">
      <span class="opacity-70">{title}</span>
    </div>
    <div class="bg-base-200 rounded-e-md rounded-b-none {classHeader}">
      <button class="btn btn-sm btn-circle no-drag btn-ghost" onclick={() => window.close()}>
        <X size={14} />
      </button>
    </div>
  </div>

  <div
    class="bg-base-200 rounded-b-md border-b-3 overflow-auto border-base-300 flex-1 flex flex-col py-3 gap-1.5 {classContent}"
  >
    <div class="flex-1 px-3 overflow-auto rounded-xl flex flex-col">
      {@render children?.()}
    </div>
  </div>
</main>

<style>
  .drag {
    -webkit-app-region: drag;
    app-region: drag;
  }

  .no-drag {
    -webkit-app-region: no-drag;
    app-region: no-drag;
  }
</style>
