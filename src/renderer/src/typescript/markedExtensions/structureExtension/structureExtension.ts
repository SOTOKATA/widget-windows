import type { Marked } from 'marked'
import { parseStructure } from './parseStructure'
import { registerStructureComponent } from './structureComponentMount'
import { structures } from './structureRegistry'

export function createStructureExtension(marked: Marked) {
  return {
    name: 'structure',
    level: 'block' as const,

    start(source: string) {
      const index = source.indexOf(':::')
      return index < 0 ? undefined : index
    },

    tokenizer(source: string) {
      if (!source.startsWith(':::')) return

      const lines = source.split(/\r?\n/)
      const closingLine = lines.findIndex((line, index) => index > 0 && /^\s*:::\s*$/.test(line))
      if (closingLine < 0) return

      const raw = lines.slice(0, closingLine + 1).join('\n')
      const parsed = parseStructure(raw)
      if (!parsed) return

      return { type: 'structure', raw, ...parsed }
    },

    renderer(token: any) {
      const structure = structures.find((item) => item.name === token.name)
      if (!structure) {
        return `<span class="text-error font-medium">Structure '${token.name}' is not found.</span>`
      }

      try {
        const result = structure.execute({
          args: token.args,
          options: token.options,
          parseMarkdown: (markdown: string) => marked.parse(markdown) as string
        })

        if (typeof result === 'string') return result

        const id = crypto.randomUUID()
        registerStructureComponent(id, result)
        return `<div data-structure-component="${id}"></div>`
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        return `<span class="text-error font-medium">${message}</span>`
      }
    }
  }
}
