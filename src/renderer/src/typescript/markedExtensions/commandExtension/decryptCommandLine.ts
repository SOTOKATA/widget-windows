import type { CommandLine } from './CommandLine'

function parseCommandArgs(rawArgs: string): string[] {
  const args: string[] = []
  let start = 0
  let depth = 0
  for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i] === '(') depth++
    else if (rawArgs[i] === ')') depth--
    else if (/\s/.test(rawArgs[i]) && depth === 0) {
      const arg = rawArgs.slice(start, i).trim()
      if (arg) args.push(arg)
      start = i + 1
    }
  }
  const last = rawArgs.slice(start).trim()
  if (last) args.push(last)
  return args
}

export function decryptCommandLine(commandName: string, rawArgs: string): CommandLine | undefined {
  const normalizedName = commandName.trim().toLowerCase()
  if (!normalizedName) return undefined

  return {
    commandName: normalizedName,
    args: parseCommandArgs(rawArgs)
  }
}
