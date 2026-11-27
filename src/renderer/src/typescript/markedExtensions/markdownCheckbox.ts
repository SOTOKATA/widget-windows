export function toggleMarkdownCheckbox(markdown: string, targetIndex: number): string {
  let checkboxIndex = -1

  return markdown.replace(
    /^(\s*(?:[-*+]|\d+[.)])\s+)\[([ xX])\](.*)$/gm,
    (match, prefix, state, rest) => {
      checkboxIndex++

      if (checkboxIndex !== targetIndex) return match

      const newState = state.toLowerCase() === 'x' ? ' ' : 'x'

      return `${prefix}[${newState}]${rest}`
    }
  )
}

