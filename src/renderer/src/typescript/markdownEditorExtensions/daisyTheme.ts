import { EditorView } from 'codemirror'

export const daisyTheme = EditorView.theme({
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
