import type { CommandArguments } from './commandArguments'

export interface ICommand {
  name: string
  execute: (env: CommandArguments) => string
}
