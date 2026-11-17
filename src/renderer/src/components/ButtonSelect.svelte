<script lang="ts">
  interface Props {
    icon?: any;
    collection: any[];
    getValue: (item: any) => string;
    getLabel: (item: any) => string;
    getButtonClass?: (item: any) => string;
    label?: string;
    value?: string;
    disabled?: boolean;
    class?: string;
    buttonClass?: string;
  }

  let {
    icon,
    collection,
    getValue,
    getLabel,
    getButtonClass,
    label,
    value = $bindable(),
    disabled = false,
    class: className,
  }: Props = $props();

  const Icon = $derived(icon);
</script>

<div class="flex flex-col gap-3">
  <div class="flex flex-row gap-2 label">
    <Icon size={14} />

    <span>{label}</span>
  </div>

  <div class="join w-full {className}">
    {#each collection as item}
      {@const itemValue = getValue(item)}
      <button
        class="btn btn-sm join-item flex-1 {getButtonClass?.(item)}"
        class:btn-primary={value === itemValue}
        {disabled}
        onclick={() => (value = itemValue)}
        type="button"
      >
        {getLabel(item)}
      </button>
    {/each}
  </div>
</div>
