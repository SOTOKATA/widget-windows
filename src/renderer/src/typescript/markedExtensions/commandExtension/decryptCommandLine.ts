import type { CommandLine } from './CommandLine'
import { parseArguments } from '../parseArguments'

export function decryptCommandLine(commandName: string, rawArgs: string): CommandLine | undefined {
  const normalizedName = commandName.trim().toLowerCase()
  if (!normalizedName) return undefined

  return {
    commandName: normalizedName,
    args: parseArguments(rawArgs).args
  }
}
