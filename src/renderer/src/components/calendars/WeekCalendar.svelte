<script lang="ts">
  import dayjs from 'dayjs'
  import 'dayjs/locale/uk'
  import type { Task } from '../../typescript/calendarTask'
  import DOMPurify from 'dompurify'

  const userLang = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en'
  if (userLang.includes('uk')) {
    dayjs.locale('uk')
  } else {
    dayjs.locale('en')
  }

  interface Props {
    tasks: Task[]
    exclude?: number[]
  }

  let { tasks, exclude }: Props = $props();

  const today = dayjs()
  let currentWeekStart = $state(today.subtract((today.day() + 6) % 7, 'day').startOf('day'))

  let weekDays = $derived.by(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      if (exclude && exclude.includes(index)) return undefined
      const date = currentWeekStart.add(index, 'day')
      return {
        index,
        name: date.format('dddd'),
        dateFormatted: date.format('D MMM'),
        isToday: date.toDate().getDay() === today.toDate().getDay()
      }
    })
  })

  function getTasksForDay(dayIndex: number) {
    return tasks.filter(task => task.day === dayIndex)
  }
</script>

<section class="max-w-full flex-row">
    <div class="flex flex-row flex-wrap gap-3 flex-1">
      {#each weekDays.filter(x => x !== undefined) as day (day.index)}
        <div class="flex flex-col max-w-[200px]">
          <div class="pb-3">
            <div class="flex flex-row gap-1 items-center">
              <div class="font-semibold capitalize text-sm">{day.name}</div>
              {#if day.isToday}
                <div aria-label="status" class="status status-primary"></div>
              {/if}
            </div>
            <div class="text-xs opacity-60">{day.dateFormatted}</div>
          </div>

          <div class="grow space-y-2 overflow-y-auto">
            {#each getTasksForDay(day.index) as task (task.id)}
              <div class="text-sm">
                <div class="font-bold text-base-content">{task.title}</div>
                {#if task.description}
                  <div
                    class="opacity-70 mt-1">{@html DOMPurify.sanitize(task.description, { ADD_ATTR: ['target'] })}</div>
                {/if}
                {#if task.startsAt.toLowerCase() !== 'xx:xx' || task.endsAt.toLowerCase() !== 'xx:xx'}
                  <div class="text-[10px] opacity-50 mt-1 font-mono">{task.startsAt} - {task.endsAt}</div>
                {/if}
              </div>
            {:else}
              <div class="text-xs opacity-40 text-center py-8">Nothing</div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
</section>
