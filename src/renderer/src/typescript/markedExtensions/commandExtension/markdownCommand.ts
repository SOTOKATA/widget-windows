import { dateTimeNow } from './commands/DateTimeCommands'
import { secretCommand } from './commands/SecretCommand'
import { findClosingParen } from '../secretAreaExtension'
import type { ICommand } from './ICommand'
import { decryptCommandLine } from './decryptCommandLine'
import { intervalCommand } from './commands/IntervalCommand'

export const commands: ICommand[] = [intervalCommand, dateTimeNow, secretCommand]

export function detectCommand(commandName: string): ICommand | undefined {
  return commands.find((c) => c.name === commandName)
}

export function createCommandExtension(markedInstance: any, registerInterval?: (id: ReturnType<typeof setInterval>) => void) {
  function executeCommandLine(source: string): string {
    const trimmed = source.trim()

    if (!trimmed.startsWith('@')) throw new Error(`Invalid command: ${source}`)

    const openParenIndex = trimmed.indexOf('(')

    if (openParenIndex <= 1) throw new Error(`Invalid command: ${source}`)

    const closeIndex = findClosingParen(trimmed, openParenIndex)

    if (closeIndex !== trimmed.length - 1) throw new Error(`Invalid command: ${source}`)

    const parsed = decryptCommandLine(
      trimmed.slice(1, openParenIndex),
      trimmed.slice(openParenIndex + 1, closeIndex)
    )

    if (!parsed) throw new Error(`Invalid command: ${source}`)

    const command = detectCommand(parsed.commandName)

    if (!command) throw new Error(`Command '${parsed.commandName}' is not found.`)

    const env = {
      html: markedInstance.parseInline(parsed.args.join('')),
      args: parsed.args,
      setContent: () => false,
      execute: executeCommandLine,
      registerInterval
    }
    return command.execute(env)
  }

  return {
    name: 'command',

    level: 'inline' as const,

    start(src: string) {
      const idx = src.indexOf('@')
      return idx === -1 ? undefined : idx
    },

    tokenizer(this: any, src: string) {
      if (!src.startsWith('@')) return

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
        commandLine
      }
    },

    renderer(this: any, object: any) {
      if (!object.commandLine) return object.raw

      const command = detectCommand(object.commandLine.commandName)

      if (!command)
        return `<span class="text-error font-medium">Command '${object.commandLine.commandName}' is not found.</span>`

      try {
        const elementId = `command-${crypto.randomUUID()}`
        return `<span id="${elementId}">${command.execute({
          html: markedInstance.parseInline(object.commandLine.args.join(' ')),
          args: object.commandLine.args,
          setContent: (content: string) => {
            const element = document.getElementById(elementId)
            if (!element) return false
            element.innerHTML = content
            return true
          },
          execute: executeCommandLine,
          registerInterval
        })}</span>`
      } catch (e: unknown) {
        return `<span class="text-error font-medium">${e.message}</span>`
      }
    }
  }
}
