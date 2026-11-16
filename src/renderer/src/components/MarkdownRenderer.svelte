<script lang="ts">
  import { Marked, type Tokens } from "marked";
  import { secretAreaExtension } from '../typescript/markedExtensions/secretAreaExtension'

  interface Props {
    content: string
  }

  let { content }: Props = $props()

  const customMarked = new Marked({
    async: false,
    renderer: {
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens)
        const titleAttr = title ? ` title="${title}"` : ''

        return `<a href="${href}"${titleAttr} class="link" target="_blank" rel="noopener noreferrer">${text}</a>`
      }
    }
  })

  customMarked.use({
    extensions: [secretAreaExtension]
  })

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
    if (target.closest('[data-secret]'))
      handleSecretClick(event)
  }

  let renderedContent = $derived(content ? customMarked.parse(content) : '')
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="flex flex-row gap-3 w-full px-3 rounded-xl items-center"
  onclick={(e) => onMarkdownContentClick(e)}
>
  <p class="markdown opacity-90 duration-200 transition-all w-full h-full">
    {@html renderedContent}
  </p>
</div>
