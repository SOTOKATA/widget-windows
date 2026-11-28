import type { IStructure, Option } from './structureExtension'
import { InvalidArgumentException } from '../commandExtension/exceptions/commandException'
import type { Task } from '../../calendarTask'
import WeekCalendar from '../../../components/calendars/WeekCalendar.svelte'

export const calendarStructure: IStructure = {
  name: 'calendar',
  execute: ({ options, args }) => {
    if (args.length !== 1) throw new InvalidArgumentException('calendar', 1)

    const type = args[0]

    const tasks = options.filter((x) => x.name === 'task').map((x) => {
      const content = options.find((option) => option.name === 'task-content' && option.args[0] === x.args[1])
      return processTask(x, content?.body)
    })

    if (type == 'week')
      return {
        component: WeekCalendar,
        props: { tasks }
      }

    return `<span class="text-error font-medium">Invalid calendar type (variants: week)</span>`
  }
}

function processTask(task: Option, description?: string): Task {
  if (task.args.length < 4) throw new InvalidArgumentException('calendar task', 4)

  const day = parseInt(task.args[0])
  const time = task.args[2]

  if (!time.includes('-'))
    throw new Error(`Invalid time format "${time}" (valid example: 10:00-11:00)`)

  const startsAt = time.split('-')[0]
  const endsAt = time.split('-')[1]

  const title = task.args.slice(3).join(' ')

  return {
    day,
    description: description ?? '',
    title,
    startsAt,
    endsAt,
    id: crypto.randomUUID()
  }
}
