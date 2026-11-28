import { parseArguments } from '../parseArguments'
import type { Option } from './structureTypes'

export interface ParsedStructure {
  name: string
  args: string[]
  options: Option[]
}

export function parseStructure(source: string): ParsedStructure | undefined {
  const lines = source.split(/\r?\n/)
  const header = lines[0]?.match(/^:::\s*(\S+)(?:\s+(.*))?$/)
  if (!header) return undefined

  const options: Option[] = []

  for (let index = 1; index < lines.length; index++) {
    const optionLine = lines[index].match(/^\s*@([\w-]+)(?:\s+(.*?))?\s*$/)
    if (!optionLine) continue

    const optionArguments = optionLine[2] ?? ''
    let parsed = parseArguments(optionArguments, true)

    if (parsed.body !== undefined) {
      const fullOption = lines
        .slice(index)
        .join('\n')
        .replace(/^\s*@[\w-]+\s*/, '')
      parsed = parseArguments(fullOption, true)
    }

    options.push({
      name: optionLine[1],
      args: parsed.args,
      ...(parsed.body !== undefined ? { body: parsed.body } : {})
    })

    index += parsed.consumedLines - 1
  }

  return {
    name: header[1],
    args: parseArguments(header[2] ?? '').args,
    options
  }
}
