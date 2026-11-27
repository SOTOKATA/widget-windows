import { printCommand } from './commands/PrintCommand'
import { dateTimeNow } from './commands/DateTimeCommands'
import { secretCommand } from './commands/SecretCommand'
import { findClosingParen } from './secretAreaExtension'

export const commands: ICommand[] = [printCommand, dateTimeNow, secretCommand]

export interface ICommand {
  name: string
  execute: (args: string[], html: string) => string
}

interface CommandLine {
  commandName: string
  args: string[]
}

function parseCommandArgs(rawArgs: string): string[] {
  const trimmed = rawArgs.trim()
  if (!trimmed) return []
  return trimmed.split(/\s+/)
}

function decryptCommandLine(commandName: string, rawArgs: string): CommandLine | undefined {
  const normalizedName = commandName.trim().toLowerCase()
  if (!normalizedName) return undefined

  return {
    commandName: normalizedName,
    args: parseCommandArgs(rawArgs)
  }
}

function detectCommand(commandName: string): ICommand | undefined {
  return commands.find((c) => c.name === commandName)
}

export const commandExtension = {
  name: 'command',

  level: 'inline' as const,

  start(src: string) {
    const idx = src.indexOf('@')
    return idx === -1 ? undefined : idx
  },

  tokenizer(this: any, src: string) {
    if (src.startsWith('@secret(') || !src.startsWith('@')) {
      return
    }

    const openParenIndex = src.indexOf('(')
    if (openParenIndex <= 1) return

    const rawName = src.slice(1, openParenIndex)
    if (/[\s@]/.test(rawName)) return

    const closeIndex = findClosingParen(src, openParenIndex)
    if (closeIndex === -1) return

    const rawMatch = src.slice(0, closeIndex + 1)
    const rawArgs = src.slice(openParenIndex + 1, closeIndex)
    const commandLine = decryptCommandLine(rawName, rawArgs)

    if (!commandLine) return

    return {
      type: 'command',
      raw: rawMatch,
      tokens: this.lexer.inlineTokens(commandLine.args),
      commandLine
    }
  },

  renderer(this: any, object: any) {
    console.log(this)
    if (!object.commandLine) return object.raw

    const command = detectCommand(object.commandLine.commandName)

    if (!command) {
      return `<div class="text-error flex flex-col gap-1">
  <span>Command '${object.commandLine.commandName}' is not found.</span>
  <span>Raw line: '${object.raw}'</span>
</div>`
    }

    return command.execute(object.commandLine.args, this.parser.parseInline(object.tokens))
  }
}
