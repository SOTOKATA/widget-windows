<script lang="ts">
  import dayjs from 'dayjs'
  import 'dayjs/locale/uk'
  import type { Task } from '../../typescript/calendarTask'

  const userLang = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en'
  if (userLang.includes('uk')) {
    dayjs.locale('uk')
  } else {
    dayjs.locale('en')
  }

  interface Props {
    tasks: Task[]
  }

  let { tasks }: Props = $props();

  const today = dayjs()
  let currentWeekStart = $state(today.subtract((today.day() + 6) % 7, 'day').startOf('day'))

  let weekDays = $derived.by(() => {
    return Array.from({ length: 7 }).map((_, index) => {
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

<section class="max-w-full @container">
  <div class="overflow-x-auto">
    <div class="grid @xl:grid-cols-7 @lg:grid-cols-5 @sm:grid-cols-3 @xs:grid-cols-2 grid-cols-1 gap-3">
      {#each weekDays as day}
        <div class="flex flex-col">
          <div class="pb-3">
            <div class="font-semibold capitalize text-sm" class:text-primary={day.isToday}>{day.name}</div>
            <div class="text-xs opacity-60">{day.dateFormatted}</div>
          </div>

          <div class="grow space-y-2 overflow-y-auto">
            {#each getTasksForDay(day.index) as task (task.id)}
              <div class="text-xs">
                <div class="font-bold text-base-content">{task.title}</div>
                {#if task.description}
                  <div class="opacity-70 mt-1">{task.description}</div>
                {/if}
                <div class="text-[10px] opacity-50 mt-1 font-mono">{task.startsAt} - {task.endsAt}</div>
              </div>
            {:else}
              <div class="text-xs opacity-40 text-center py-8">Nothing</div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
