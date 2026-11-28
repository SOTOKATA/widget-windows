import type { IStructure, Option } from './structureTypes'
import { InvalidArgumentException } from '../commandExtension/exceptions/commandException'
import type { Task } from '../../calendarTask'
import WeekCalendar from '../../../components/calendars/WeekCalendar.svelte'

export const calendarStructure: IStructure = {
  name: 'calendar',
  execute: ({ options, args, parseMarkdown }) => {
    if (args.length !== 1) throw new InvalidArgumentException('calendar', 1)

    const type = args[0]

    const tasks = options
      .filter((option) => option.name === 'task')
      .map((task) => processTask(task, parseMarkdown))

    const excludeOption = options.find(x => x.name === 'exclude')

    if (type == 'week')
      return {
        component: WeekCalendar,
        props: { tasks, exclude: excludeOption ? processExclude(excludeOption) : undefined }
      }

    return `<span class="text-error font-medium">Invalid calendar type (variants: week)</span>`
  }
}

function processExclude(exclude: Option): number[] {
  return exclude.args.map(x => parseInt(x))
}

function processTask(task: Option, parseMarkdown: (markdown: string) => string): Task {
  if (task.args.length !== 3) throw new InvalidArgumentException('calendar task', 3)

  const day = parseInt(task.args[0])
  const time = task.args[1]

  if (!time.includes('-') && time.length !== 11)
    throw new Error(`Invalid time format "${time}" (valid example: XX:XX-XX:XX)`)

  const startsAt = time.split('-')[0]
  const endsAt = time.split('-')[1]

  const title = task.args[2]

  return {
    day,
    description: task.body ? parseMarkdown(task.body) : '',
    title,
    startsAt,
    endsAt,
    id: crypto.randomUUID()
  }
}
