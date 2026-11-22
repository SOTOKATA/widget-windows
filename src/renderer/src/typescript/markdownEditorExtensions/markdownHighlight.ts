import { HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'

export const markdownHighlight = HighlightStyle.define([
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
