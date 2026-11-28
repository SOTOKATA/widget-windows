<script lang="ts">
  import { createCustomMarked } from '../typescript/markedExtensions/customMarked'
  import { globals } from '../typescript/globals.svelte'
  import type { MarkdownSettings } from '@app-types/MarkdownSettings'
  import DOMPurify from 'dompurify'
  import { mountStructureComponents } from '../typescript/markedExtensions/structureExtension/structureComponentMount'

  interface Props {
    content: string
    customMarkdownPreferences?: MarkdownSettings
  }

  let { content, customMarkdownPreferences }: Props = $props()

  const customMarked = $derived(
    createCustomMarked(customMarkdownPreferences ?? globals.settings.markdownSettings)
  )

  function handleSecretClick(event: MouseEvent): boolean {
    const target = event.target as HTMLElement
    const secret = target.closest('[data-secret]') as HTMLElement | null

    if (!secret) return false

    secret.classList.toggle('blur-xs')
    secret.classList.toggle('blur-none')

    return true
  }

  function onMarkdownContentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    if (target.closest('[data-secret]')) handleSecretClick(event)
  }

  let renderedContent = $derived(
    content ? DOMPurify.sanitize(customMarked.parse(content), { ADD_ATTR: ['target'] }) : ''
  )
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="flex flex-row gap-3 w-full px-3 rounded-xl items-center"
  onclick={(e) => onMarkdownContentClick(e)}
>
  <div class="markdown opacity-90 duration-200 transition-all w-full h-full" use:mountStructureComponents>
    {@html renderedContent}
  </div>
</div>
