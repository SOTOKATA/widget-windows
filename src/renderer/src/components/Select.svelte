<script lang="ts">
  interface Props {
    id: string;
    unselected?: boolean;
    icon?: any;
    inlineLabel?: boolean;
    inlineIcon?: boolean;
    collection: any[];
    getValue: (item: any) => string;
    getLabel: (item: any) => string;
    required?: boolean;
    label?: string;
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    description?: string;
    error?: string;
    class?: string;
    onselect?: (value: any) => void;
  }

  let {
    id,
    icon,
    inlineLabel = false,
    inlineIcon = false,
    collection,
    unselected = false,
    getValue,
    getLabel,
    required = false,
    label,
    placeholder,
    value = $bindable(),
    disabled = false,
    description,
    error,
    class: className,
    onselect
  }: Props = $props();

  let focused = $state(false);
  const Icon = $derived(icon);
</script>

<div class="flex flex-col gap-1 w-full h-full">
  {#if (Icon && !inlineIcon) || (label && !inlineLabel)}
    <div class="flex flex-row gap-1 items-center">
      {#if Icon && !inlineIcon}
        <div class="opacity-70">
          <Icon
            size={12}
            class="{focused ? 'text-primary' : ''} duration-100 transition-colors"
          />
        </div>
      {/if}

      {#if label && !inlineLabel}
        <label
          for={id}
          class="label text-sm {focused ? 'text-primary' : ''} duration-100 transition-colors"
        >
          {label}
        </label>
      {/if}
    </div>
  {/if}

  <label
    class="select select-sm w-full duration-100 transition-colors
               focus-within:outline-none! focus-within:ring-0! flex-1 h-full
               {focused ? 'border-primary' : ''}
               {className}"
  >
    {#if Icon && inlineIcon}
      <Icon
        size={12}
        class="{focused ? 'text-primary' : ''} opacity-70 duration-100 transition-colors"
      />
    {/if}

    {#if label && inlineLabel}
            <span
              class="label text-sm {focused ? 'text-primary' : ''} duration-100 transition-colors"
            >
                {label}
            </span>
    {/if}

    <select
      class="min-w-0 grow text-xs focus:outline-none! focus:ring-0! py-1.5! h-full"
      {id}
      name={id}
      {required}
      {disabled}
      bind:value
      aria-label={label}
      onfocus={() => focused = true}
      onfocusout={() => focused = false}
      onchange={(e) => onselect?.(e.currentTarget.value)}
    >
      {#if unselected}
        <option value="" disabled={required}>
          {placeholder ?? ''}
        </option>
      {/if}

      {#each collection as item}
        <option value={getValue(item)}>
          {getLabel(item)}
        </option>
      {/each}
    </select>
  </label>

  {#if error || description}
    <p class="ps-1 text-xs {error ? 'text-error font-medium' : 'opacity-40'}">
      {error ?? description}
    </p>
  {/if}
</div>
