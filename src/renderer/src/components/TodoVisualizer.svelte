<script lang="ts">
  import type { Todo } from "../typescript/Todo";
  import { getDaysUntil } from "../typescript/adaptiveDate";
  import { Marked, type Tokens } from "marked";
  import ContentBreaker from "./ContentBreaker.svelte";

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
      return 'px-3 py-2 rounded-md bg-error/30 border border-error/40';
    else if (todo.type === 'important')
      return 'px-3 py-2 rounded-md bg-warning/30 border border-warning/40';
    else return 'px-3 py-2 rounded-md bg-black/10 border border-black/5';
  }

  const customMarked = new Marked({
    async: false,
    renderer: {
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const titleAttr = title ? ` title="${title}"` : '';

        return `<a href="${href}"${titleAttr} class="link" target="_blank" rel="noopener noreferrer">${text}</a>`;
      }
    }
  });

  let renderedDescription = $derived(
    todo.description ? customMarked.parse(todo.description) : ''
  );
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

  {#if todo.description}
    <div class="flex flex-row gap-3 w-full items-center">
      <input type="checkbox" readonly class="checkbox checkbox-sm checkbox-ghost invisible" />
        <ContentBreaker sizeY={150} bind:todo>
          <p class="markdown opacity-90 {completedTextClasses()}">
            {@html renderedDescription}
          </p>
        </ContentBreaker>
    </div>
  {/if}
</section>
