import { calendarStructure } from './calendarStructure'
import type { Component } from 'svelte'
import { mount, unmount } from 'svelte'

export interface Option {
  name: string
  args: string[]
  body?: string
}

export interface StructureArguments {
  args: string[]
  options: Option[]
}

export interface IStructure {
  name: string
  execute: (arguments_: StructureArguments) => string | IComponentLink
}

export interface IComponentLink {
  component: Component<any>
  props?: Record<string, unknown>
}

const componentLinks = new Map<string, IComponentLink>()

export function mountStructureComponents(root: HTMLElement): () => void {
  const mounted = new Map<HTMLElement, () => void>()
  const scan = () => {
    for (const [element, unmount] of mounted) {
      if (!element.isConnected || !root.contains(element)) {
        unmount()
        mounted.delete(element)
      }
    }
    for (const host of root.querySelectorAll<HTMLElement>('[data-structure-component]')) {
      if (mounted.has(host)) continue
      const id = host.dataset.structureComponent
      const link = id ? componentLinks.get(id) : undefined
      if (!id || !link) continue
      componentLinks.delete(id)
      const { unmount } = requireSvelteMount(link, host)
      mounted.set(host, unmount)
    }
  }
  const observer = new MutationObserver(scan)
  observer.observe(root, { childList: true, subtree: true })
  scan()
  return () => {
    observer.disconnect()
    for (const unmount of mounted.values()) unmount()
    mounted.clear()
  }
}

function requireSvelteMount(link: IComponentLink, target: HTMLElement): { unmount: () => void } {
  const instance = mount(link.component, { target, props: link.props ?? {} })
  return { unmount: () => { void unmount(instance) } }
}

export const structures: IStructure[] = []

export function registerStructure(structure: IStructure): void {
  const existingIndex = structures.findIndex((item) => item.name === structure.name)
  if (existingIndex === -1) structures.push(structure)
  else structures[existingIndex] = structure
}

registerStructure(calendarStructure)

function parseArgs(source: string): string[] {
  const args: string[] = []
  const pattern = /"([^"]*)"|'([^']*)'|(\S+)/g
  for (const match of source.matchAll(pattern)) args.push(match[1] ?? match[2] ?? match[3])
  return args
}

function parseStructure(
  source: string
): { name: string; args: string[]; options: Option[] } | undefined {
  const lines = source.split(/\r?\n/)
  const header = lines[0]?.match(/^:::\s*(\S+)(?:\s+(.*))?$/)
  if (!header) return undefined

  const options: Option[] = []
  for (let i = 1; i < lines.length; i++) {
    const optionLine = lines[i].match(/^\s*@([\w-]+)(?:\s+(.*?))?\s*$/)
    if (!optionLine) continue
    let rawArgs = optionLine[2] ?? ''
    let body: string | undefined
    const inlineOpen = rawArgs.indexOf('{')
    if (inlineOpen !== -1) {
      rawArgs = rawArgs.slice(0, inlineOpen).trim()
      const bodyLines: string[] = []
      const afterOpen = optionLine[2]!.slice(inlineOpen + 1)
      const inlineClose = afterOpen.lastIndexOf('}')
      if (inlineClose !== -1) {
        if (afterOpen.slice(0, inlineClose).trim()) bodyLines.push(afterOpen.slice(0, inlineClose))
        body = bodyLines.join('\n')
      } else {
        if (afterOpen) bodyLines.push(afterOpen)
        while (++i < lines.length && !/^\s*}\s*$/.test(lines[i])) bodyLines.push(lines[i])
        body = bodyLines.join('\n').replace(/^\n|\n$/g, '')
      }
    }
    options.push({
      name: optionLine[1],
      args: parseArgs(rawArgs),
      ...(body !== undefined ? { body } : {})
    })
  }

  return { name: header[1], args: parseArgs(header[2] ?? ''), options }
}

export function createStructureExtension() {
  return {
    name: 'structure',
    level: 'block' as const,
    start(src: string) {
      const index = src.indexOf(':::')
      return index < 0 ? undefined : index
    },
    tokenizer(src: string) {
      if (!src.startsWith(':::')) return
      const lines = src.split(/\r?\n/)
      let closingLine = -1
      for (let i = 1; i < lines.length; i++) {
        if (/^\s*:::\s*$/.test(lines[i])) {
          closingLine = i
          break
        }
      }
      if (closingLine < 0) return
      const raw = lines.slice(0, closingLine + 1).join('\n')
      const parsed = parseStructure(raw)
      if (!parsed) return
      return { type: 'structure', raw, ...parsed }
    },
    renderer(token: any) {
      const structure = structures.find((item) => item.name === token.name)
      if (!structure)
        return `<span class="text-error font-medium">Structure '${token.name}' is not found.</span>`
      try {
        const result = structure.execute({ args: token.args, options: token.options })

        if (typeof result === 'string') return result
        const id = crypto.randomUUID()
        componentLinks.set(id, result)
        return `<div data-structure-component="${id}"></div>`
      } catch (error) {
        return `<span class="text-error font-medium">${error instanceof Error ? error.message : String(error)}</span>`
      }
    }
  }
}
