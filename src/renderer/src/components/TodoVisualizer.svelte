<script lang="ts">
  import type { Todo } from "../typescript/Todo";

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
</script>

<section class="flex flex-col"
   data-menu-type
   data-id={todo.id}
>
  <label class="flex flex-row gap-3 w-full items-center">
    <input type="checkbox" class="checkbox checkbox-sm checkbox-ghost"
           bind:checked={completed}
           onchange={() => toggleCompleted()}
    />
    <span class="font-semibold {completedTextClasses()}">{todo.title}</span>
  </label>

  <div class="flex flex-row gap-3 w-full items-center">
    <input type="checkbox" readonly class="checkbox checkbox-sm checkbox-ghost invisible" />
    {#if todo.description}
      <p class="opacity-70 italic {completedTextClasses()}">{todo.description}</p>
    {/if}
  </div>
</section>
