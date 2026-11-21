<script lang="ts">
  import { onMount } from 'svelte'
  import { EditorView, basicSetup } from 'codemirror'
  import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
  import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
  import { tags } from '@lezer/highlight'
  import { keymap } from '@codemirror/view'
  import { indentWithTab } from '@codemirror/commands'

  interface Props {
    content?: string
    readOnly?: boolean
    fontSize?: number
    autofocus?: boolean
  }

  let {
    content = $bindable(''),
    readOnly = false,
    fontSize = 14,
    autofocus = false
  }: Props = $props()

  let editorElement: HTMLDivElement
  let editor: EditorView | undefined


  const markdownHighlight = HighlightStyle.define([
    {
      tag: tags.heading,
      color: 'var(--color-primary)',
      fontWeight: '700'
    },
    {
      tag: tags.strong,
      color: 'var(--color-secondary)',
      fontWeight: '700'
    },
    {
      tag: tags.emphasis,
      color: 'var(--color-accent)',
      fontStyle: 'italic'
    },
    {
      tag: tags.link,
      color: 'var(--color-info)',
      textDecoration: 'underline'
    },
    {
      tag: tags.url,
      color: 'var(--color-info)'
    },
    {
      tag: tags.quote,
      color: 'var(--color-base-content)',
      fontStyle: 'italic'
    },
    {
      tag: tags.monospace,
      color: 'var(--color-success)'
    },
    {
      tag: tags.comment,
      color: 'var(--color-base-content)',
      opacity: '0.6'
    }
  ])

  const daisyTheme = EditorView.theme({
    '&': {
      width: '100%',
      height: '100%',
      minWidth: '0',
      minHeight: '0',
      maxWidth: '100%',
      maxHeight: '100%',
      overflow: 'hidden',
      backgroundColor: 'var(--color-base-100)',
      color: 'var(--color-base-content)',
      borderRadius: 'var(--radius-sm)'
    },

    '&.cm-focused': {
      outline: 'none'
    },

    '.cm-scroller': {
      height: '100%',
      minHeight: '0',
      maxHeight: '100%',
      overflow: 'auto',
      fontFamily: 'var(--font-mono, monospace)'
    },

    '.cm-content': {
      padding: '12px 0',
      caretColor: 'var(--color-primary)'
    },

    '.cm-line': {
      padding: '0 12px'
    },

    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: 'var(--color-primary)'
    },

    '.cm-selectionBackground': {
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 25%, transparent)'
    },

    '&.cm-focused .cm-selectionBackground': {
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 35%, transparent)'
    },

    '.cm-gutters': {
      backgroundColor: 'var(--color-base-200)',
      color: 'color-mix(in srgb, var(--color-base-content) 50%, transparent)',
      borderRight: '1px solid var(--border-transparent)'
    },

    '.cm-activeLineGutter': {
      backgroundColor: 'var(--color-base-100)',
      color: 'var(--color-base-content)'
    },

    '.cm-activeLine': {
      backgroundColor: 'color-mix(in srgb, var(--color-base-content) 5%, transparent)'
    },

    '.cm-matchingBracket': {
      backgroundColor: 'var(--color-base-300)',
      outline: '1px solid var(--color-primary)'
    },

    '.cm-tooltip': {
      backgroundColor: 'var(--color-base-100)',
      color: 'var(--color-base-content)',
      border: '1px solid var(--color-base-300)',
      borderRadius: 'var(--radius-field)'
    },

    '.cm-panels': {
      backgroundColor: 'var(--color-base-100)',
      color: 'var(--color-base-content)'
    },

    '.cm-searchMatch': {
      backgroundColor: 'color-mix(in srgb, var(--color-warning) 35%, transparent)'
    },

    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 40%, transparent)'
    }
  })

  onMount(() => {
    editor = new EditorView({
      doc: content,
      parent: editorElement,
      extensions: [
        basicSetup,
        markdown(),
        daisyTheme,
        markdownLanguage.data.of({
          closeBrackets: {
            brackets: ['(', '[', '{', '"', "'", '*', '_', '`']
          }
        }),
        syntaxHighlighting(markdownHighlight),
        keymap.of(indentWithTab),
        EditorView.domEventHandlers({
          focus: () => {
            focused = true
          },
          blur: () => {
            focused = false
          }
        }),

        EditorView.lineWrapping,
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

  $effect(() => {
    editorElement?.style.setProperty('--editor-font-size', `${fontSize}px`)
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
