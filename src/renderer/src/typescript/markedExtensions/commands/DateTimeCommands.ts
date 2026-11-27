import dayjs from 'dayjs'
import type { ICommand } from '../markdownCommand'

export const dateTimeNow: ICommand = {
  name: 'date.now',
  execute: (args) => {
    const template = args.join(' ').trim()
    const now = dayjs()

    if (!template) {
      return now.toISOString()
    }

    return now.format(template)
  }
}
