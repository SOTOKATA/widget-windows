import type { ICommand } from '../markdownCommand'

export const printCommand: ICommand = {
  name: 'print',
  execute: (args: string[]): string => {
    return `<span>${args.join(' ')}</span>`
  }
}
