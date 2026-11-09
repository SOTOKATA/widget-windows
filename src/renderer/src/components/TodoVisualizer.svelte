<script lang="ts">
  import type { Todo } from "../typescript/Todo";
  import { getDaysUntil } from "../typescript/adaptiveDate";

  interface Props {
    todo: Todo;
    onUpdateTodo: (id: string, data: Partial<Todo>) => Promise<void>;
  }

  let {
    todo,
    onUpdateTodo
  }: Props = $props()

  function completedTextClasses(): string {
    return completed ? ' line-through ' : '';
  }

  let completed: boolean = $state(todo.completed ?? false);

  async function toggleCompleted(): Promise<void> {
    await onUpdateTodo(todo.id, { completed });
  }

  function bgClasses(): string {
    if (todo.type === 'critical' || getDaysUntil(todo.completeUntil) === 'Tomorrow')
      return 'px-3 py-2 rounded-md bg-error/30 border border-error/10';
    else if (todo.type === 'important')
      return 'px-3 py-2 rounded-md bg-warning/30 border border-warning/10';


    return '';
  }
</script>

<section class="flex flex-col {bgClasses()}"
   data-menu-type
   data-id={todo.id}
>
  <label class="flex flex-row gap-3 w-full items-center justify-between">
    <div class="flex flex-row gap-3 items-center">
      <input type="checkbox" class="checkbox checkbox-sm checkbox-ghost"
             bind:checked={completed}
             onchange={() => toggleCompleted()}
      />
      <span class="font-semibold cursor-pointer {completedTextClasses()}">{todo.title}</span>
    </div>

    {#if todo.completeUntil}
      <span class="badge-sm bg-black/20 px-2 py-0.5 rounded-md">
        {getDaysUntil(todo.completeUntil)}
      </span>
    {/if}
  </label>

  <div class="flex flex-row gap-3 w-full items-center">
    <input type="checkbox" readonly class="checkbox checkbox-sm checkbox-ghost invisible" />
    {#if todo.description}
      <p class="opacity-70 italic cursor-pointer {completedTextClasses()}">{todo.description}</p>
    {/if}
  </div>
</section>
