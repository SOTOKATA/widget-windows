<script lang="ts">
  interface Props {
    id: string;
    icon?: any;
    required?: boolean;
    label?: string;
    value?: boolean;
    disabled?: boolean;
    description?: string;
    error?: string;
    class?: string;
  }

  let {
    id,
    icon,
    required = false,
    label,
    value = $bindable(),
    disabled = false,
    description,
    error,
    class: className
  }: Props = $props();
</script>

<div class="flex flex-col gap-1 w-full">
  <label
    for={id}
    class="flex flex-row gap-3 justify-between items-center w-full rounded-xl border px-3 py-2 cursor-pointer transition-colors
            {value ? 'border-primary bg-primary/10 text-primary' : 'border-base-300 bg-base-200 text-base-content'}
            {disabled ? 'cursor-not-allowed opacity-60' : ''}"
  >
        <span class="flex flex-row gap-3 items-center">
            <span class="opacity-70">
            {#if icon}
                <svelte:component this={icon} size={14} />
            {/if}
        </span>
        <span class="label text-sm select-none">
            {label}
        </span>
        </span>

    <input
      class="checkbox-input toggle toggle-primary border-none bg-base-300 checked:bg-transparent shadow-none outline-none focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none active:border-0 active:outline-none {className}"
      {id}
      name={id}
      type="checkbox"
      {required}
      {disabled}
      bind:checked={value}
    />
  </label>

  {#if error || description}
    <p class="ps-1 text-xs {error ? 'text-error font-medium' : 'opacity-40'}">{error ?? description}</p>
  {/if}
</div>

<style>
  .checkbox-input,
  .checkbox-input:focus,
  .checkbox-input:focus-visible,
  .checkbox-input:active {
    border-color: transparent !important;
    box-shadow: none !important;
    outline: none !important;
  }
</style>
