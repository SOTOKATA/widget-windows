function findClosingParen(src: string, openIndex: number): number {
  let depth = 1
  let i = openIndex + 1

  while (i < src.length) {
    const char = src[i]

    // Пропускаем экранированные символы: \( \) \\
    if (char === '\\') {
      i += 2
      continue
    }

    // Пропускаем inline code с любым количеством backticks
    if (char === '`') {
      let ticks = 1

      while (src[i + ticks] === '`') ticks++

      const marker = '`'.repeat(ticks)
      const closingIndex = src.indexOf(marker, i + ticks)

      if (closingIndex !== -1) {
        i = closingIndex + ticks
        continue
      }
    }

    if (char === '(') {
      depth++
    } else if (char === ')') {
      depth--

      if (depth === 0) {
        return i
      }
    }

    i++
  }

  return -1
}

export const secretAreaExtension = {
  name: 'secret',

  level: 'inline' as const,

  start(src: string) {
    return src.indexOf('@secret(')
  },

  tokenizer(this: any, src: string) {
    const prefix = '@secret('

    if (!src.startsWith(prefix)) return

    const closeIndex = findClosingParen(src, prefix.length - 1)

    if (closeIndex === -1) return

    const text = src.slice(prefix.length, closeIndex)

    return {
      type: 'secret',
      raw: src.slice(0, closeIndex + 1),
      text,
      tokens: this.lexer.inlineTokens(text)
    }
  },

  renderer(this: any, token: any) {
    const html = this.parser.parseInline(token.tokens)

    return `
      <span
        class="secret-text blur-xs cursor-pointer select-none transition-all duration-300"
        data-secret="true"
      >${html}</span>
    `
  }
}
