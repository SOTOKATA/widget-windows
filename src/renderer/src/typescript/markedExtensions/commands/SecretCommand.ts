import type { ICommand } from '../markdownCommand'

export const secretCommand: ICommand = {
  name: '_secret',
  execute: (_args: string[], html: string): string => {
    return `<span>${html}</span>`
  }
}
