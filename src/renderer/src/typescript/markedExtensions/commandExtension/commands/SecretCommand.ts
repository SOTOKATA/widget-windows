import type { ICommand } from '../ICommand'

export const secretCommand: ICommand = {
  name: 'secret',
  execute: ({ html }): string => {
    return `
      <span
        class="secret-text blur-xs cursor-pointer select-none transition-all duration-300"
        data-secret="true"
      >${html}</span>
    `
  }
}
