import { Marked, type Tokens } from 'marked'
import type { MarkdownSettings } from '@app-types/MarkdownSettings'
import { secretAreaExtension } from './secretAreaExtension'

export function createCustomMarked(settings: MarkdownSettings) {
  const marked = new Marked({
    async: false,
    gfm: true,
    renderer: {
      heading({ depth, tokens }: Tokens.Heading) {
        const text = this.parser.parseInline(tokens)
        const tag = `h${depth}` as keyof MarkdownSettings

        return `<${tag} class="${settings[tag]}">${text}</${tag}>\n`
      },

      paragraph({ tokens }: Tokens.Paragraph) {
        const text = this.parser.parseInline(tokens)

        return `<p class="${settings.p}">${text}</p>\n`
      },

      blockquote({ tokens }: Tokens.Blockquote) {
        const text = this.parser.parse(tokens)

        return `<blockquote class="${settings.blockquote}">${text}</blockquote>\n`
      },

      table(token: Tokens.Table) {
        let header = ''
        let body = ''

        // Table header
        const headerCells = token.header.map((cell) => this.tablecell(cell)).join('')

        header = this.tablerow({ text: headerCells })

        // Table body
        for (const row of token.rows) {
          const cells = row.map((cell) => this.tablecell(cell)).join('')

          body += this.tablerow({ text: cells })
        }

        return `
          <table class="${settings.table}">
            <thead>${header}</thead>
            ${body ? `<tbody>${body}</tbody>` : ''}
          </table>
        `
      },

      list(token: Tokens.List) {
        const tag = token.ordered ? 'ol' : 'ul'
        const className = token.ordered ? settings.ol : settings.ul

        const startAttr = token.ordered && token.start !== 1 ? ` start="${token.start}"` : ''

        const items = token.items.map((item) => this.listitem(item)).join('')

        return `<${tag} class="${className}"${startAttr}>${items}</${tag}>\n`
      },

      listitem(token: Tokens.ListItem) {
        const text = this.parser.parse(token.tokens)

        return `<li class="${settings.li} ${token.checked ? 'line-through italic' : ''}"${token.task ? ' data-task-item="true"' : ''}>${text}</li>\n`
      },

      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens)
        const titleAttr = title ? `title="${title}"` : ''

        return `<a href="${href}" ${titleAttr} class="link" target="_blank" rel="noopener noreferrer">${text}</a>`
      }
    }
  })

  marked.use({
    extensions: [secretAreaExtension]
  })

  return marked
}
