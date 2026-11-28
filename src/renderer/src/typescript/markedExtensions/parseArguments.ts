export interface ParsedArguments {
  args: string[]
  body?: string
  consumedLines: number
}

/** Splits arguments on whitespace outside quotes/parentheses and optionally reads a `{...}` body. */
export function parseArguments(source: string, allowBody = false): ParsedArguments {
  const args: string[] = []
  let token = ''
  let quote: '"' | "'" | undefined
  let parentheses = 0
  let index = 0

  const push = () => {
    if (token) args.push(token)
    token = ''
  }

  for (; index < source.length; index++) {
    const char = source[index]
    if (char === '\\' && index + 1 < source.length) {
      const next = source[index + 1]
      if (quote || /[\\"'\s]/.test(next)) {
        token += next
        index++
        continue
      }
    }
    if (quote) {
      if (char === quote) quote = undefined
      else token += char
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      continue
    }
    if (char === '(') parentheses++
    else if (char === ')') parentheses = Math.max(0, parentheses - 1)

    if (allowBody && char === '{' && parentheses === 0) {
      push()
      const bodyStart = index + 1
      const closeOnLine = source.slice(bodyStart).match(/^[^\r\n]*?\}/)
      if (closeOnLine) {
        const body = closeOnLine[0].slice(0, -1).trim()
        const bodyEnd = bodyStart + closeOnLine[0].length
        return { args, body, consumedLines: source.slice(0, bodyEnd).split(/\r?\n/).length }
      }
      const closeIndex = source.slice(bodyStart).search(/^\s*}\s*$/m)
      if (closeIndex === -1) return { args, body: source.slice(bodyStart).trim(), consumedLines: source.split(/\r?\n/).length }
      const absoluteClose = bodyStart + closeIndex
      const body = source.slice(bodyStart, absoluteClose).replace(/^\r?\n|\r?\n$/g, '')
      return {
        args,
        body,
        consumedLines: source.slice(0, absoluteClose).split(/\r?\n/).length + 1
      }
    }

    if (/\s/.test(char) && parentheses === 0) push()
    else token += char
  }

  push()
  return { args, consumedLines: 1 }
}
