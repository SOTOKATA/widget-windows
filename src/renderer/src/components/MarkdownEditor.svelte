<script lang="ts">
  import { onMount } from 'svelte'
  import { EditorView, basicSetup } from 'codemirror'
  import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
  import { syntaxHighlighting } from '@codemirror/language'
  import { keymap } from '@codemirror/view'
  import { indentWithTab } from '@codemirror/commands'
  import { editorZoom } from '../typescript/markdownEditorExtensions/editorZoom'
  import { markdownHighlight } from '../typescript/markdownEditorExtensions/markdownHighlight'
  import { daisyTheme } from '../typescript/markdownEditorExtensions/daisyTheme'

  interface Props {
    content?: string
    readOnly?: boolean
    autofocus?: boolean
  }

  let { content = $bindable(''), readOnly = false, autofocus = false }: Props = $props()

  let editorElement: HTMLDivElement
  let editor: EditorView | undefined

  onMount(() => {
    editor = new EditorView({
      doc: content,
      parent: editorElement,
      extensions: [
        basicSetup,
        markdown(),
        daisyTheme,
        editorZoom(14),
        markdownLanguage.data.of({
          closeBrackets: {
            brackets: ['(', '[', '{', '"', "'", '*', '_', '`']
          }
        }),
        syntaxHighlighting(markdownHighlight),
        keymap.of([indentWithTab]),
        EditorView.domEventHandlers({
          focus: () => {
            focused = true
          },
          blur: () => {
            focused = false
          }
        }),

        EditorView.editable.of(!readOnly),

        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const value = update.state.doc.toString()

            if (content !== value) {
              content = value
            }
          }
        })
      ]
    })

    if (autofocus) {
      editor.focus()
    }

    return () => {
      editor?.destroy()
      editor = undefined
    }
  })

  $effect(() => {
    const value = content ?? ''

    if (!editor) return

    const current = editor.state.doc.toString()

    if (current !== value) {
      editor.dispatch({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: value
        }
      })
    }
  })

  let focused: boolean = $state(false)
</script>

<div
  class="
    markdown-editor h-full max-h-full min-h-0 min-w-0 w-full max-w-full rounded-sm overflow-hidden border bg-base-100
    duration-100 transition-colors
    {focused ? 'border-primary' : 'border-gray-600'}
  "
>
  <div
    onfocus={() => (focused = true)}
    onfocusout={() => (focused = false)}
    class="h-full min-h-0 min-w-0 w-full overflow-hidden"
    bind:this={editorElement}
  ></div>
</div>

<style>
  .markdown-editor :global(.cm-editor) {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
    font-size: var(--editor-font-size, 14px);
  }

  .markdown-editor :global(.cm-scroller) {
    height: 100%;
    min-height: 0;
    overflow: auto;
  }
</style>
