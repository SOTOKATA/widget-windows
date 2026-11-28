import type { ICommand } from '../ICommand'
import { InvalidArgumentException } from '../exceptions/commandException'
import type { CommandArguments } from '../commandArguments'

export const intervalCommand: ICommand = {
  name: 'interval',
  execute: ({ args, setContent, execute, registerInterval }: CommandArguments): string => {
    if (args.length !== 2) throw new InvalidArgumentException('interval', 2)

    const time = parseInt(args[0])

    const command = args[1]

    if (!Number.isFinite(time) || time <= 0) throw new InvalidArgumentException('interval', 2)

    const interval = setInterval(() => {
      if (!setContent(execute(command))) {
        clearInterval(interval)
        return
      }
    }, time)
    registerInterval?.(interval)

    return execute(command)
  }
}
