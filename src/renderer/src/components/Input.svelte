<script lang="ts">
  import { enableTyping } from '../typescript/inputTools'

  interface Props {
    id: string
    icon?: any
    type: 'text' | 'email' | 'password' | 'tel' | 'textarea' | 'number' | 'datetime-local'
    required?: boolean
    label?: string
    placeholder?: string
    value?: string
    disabled?: boolean
    description?: string
    error?: string
    class?: string
    inlineIcon?: boolean
    inlineLabel?: boolean
    maxLength?: number
    minLength?: number
    min?: string
    widget?: boolean
  }

  let {
    id,
    type = 'text',
    icon,
    required = false,
    label,
    placeholder,
    value = $bindable(),
    disabled = false,
    description,
    widget = false,
    error,
    min = '',
    inlineIcon = false,
    inlineLabel = false,
    class: className,
    maxLength,
    ...rest
  }: Props = $props()

  let focused: boolean = $state(false)
  const Icon = $derived(icon)
</script>

<div class="flex flex-col gap-1 w-full h-full">
  {#if (!inlineLabel && label) || (!inlineIcon && Icon)}
    <div class="flex flex-row gap-1 items-center">
      {#if !inlineIcon && Icon}
        <div class="opacity-70">
          <Icon size={12} class="{focused ? 'text-primary' : ''} duration-100 transition-colors" />
        </div>
      {/if}

      {#if label && !inlineLabel}
        <label
          for={id}
          class="label text-sm {focused ? 'text-primary' : ''} duration-100 transition-colors"
          >{label}</label
        >
      {/if}
    </div>
  {/if}

  {#if type === 'textarea'}
    <div class="relative flex-1">
      <textarea
        name={id}
        {id}
        onmousedown={() => {
          if (widget) enableTyping(this)
        }}
        bind:value
        class="textarea w-full h-full bg-transparent! duration-100 transition-colors h-full resize-none focus:outline-none! focus:ring-0! {focused
          ? 'border-primary'
          : ''} {className}"
        {required}
        {placeholder}
        {disabled}
        onfocus={() => (focused = true)}
        onfocusout={() => (focused = false)}
        maxlength={maxLength}
        {...rest}></textarea>

      <div class="absolute bottom-0 right-0 pb-0.5 pe-1 opacity-40">
        {#if maxLength}
          <div
            class=" text-sm {value?.length === maxLength
              ? 'text-error'
              : 'opacity-50 ' + (focused ? 'text-primary' : '')}"
          >
            {maxLength - (value?.length ?? 0)}
          </div>
        {/if}
      </div>
    </div>
  {:else}
    {#if (inlineIcon && Icon) || (inlineLabel && label)}
      <div
        class="input input-sm w-full bg-transparent! duration-100 realative transition-colors {focused
          ? 'border-primary'
          : ''} focus:outline-none focus:ring-0 focus-within:outline-none focus-within:ring-0 {className}"
      >
        <span class="">
          {#if Icon && inlineIcon}
            <Icon
              size={12}
              class="{focused ? 'text-primary' : ''} opacity-70 duration-100 transition-colors"
            />
          {/if}
          {#if label && inlineLabel}
            <label
              for={id}
              class="label text-sm {focused ? 'text-primary' : ''} duration-100 transition-colors"
              >{label}</label
            >
          {/if}
        </span>
        <input
          onmousedown={() => {
            if (widget) enableTyping(this)
          }}
          class="grow w-full text-xs focus:outline-none! focus:ring-0!"
          {id}
          name={id}
          {type}
          {min}
          {required}
          {placeholder}
          {disabled}
          bind:value
          onfocus={() => (focused = true)}
          maxlength={maxLength}
          onfocusout={() => (focused = false)}
          {...rest}
        />

        <div class="absolute bottom-[20%] right-0 pe-2.5 opacity-40">
          {#if maxLength}
            <div
              class=" text-sm {value?.length === maxLength
                ? 'text-error'
                : 'opacity-50 ' + (focused ? 'text-primary' : '')}"
            >
              {maxLength - (value?.length ?? 0)}
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="relative">
        <input
          class="input input-sm w-full bg-transparent! duration-100 transition-colors {focused
            ? 'border-primary'
            : ''} focus:outline-none! focus:ring-0! {className}"
          {id}
          {min}
          onmousedown={() => {
            if (widget) enableTyping(this)
          }}
          name={id}
          {type}
          {required}
          {placeholder}
          {disabled}
          bind:value
          maxlength={maxLength}
          onfocus={() => (focused = true)}
          onfocusout={() => (focused = false)}
          {...rest}
        />

        <div class="absolute bottom-[20%] right-0 pe-2.5 opacity-40">
          {#if maxLength}
            <div
              class=" text-sm {value?.length === maxLength
                ? 'text-error'
                : 'opacity-50 ' + (focused ? 'text-primary' : '')}"
            >
              {maxLength - (value?.length ?? 0)}
            </div>
          {/if}
        </div>
      </div>
    {/if}
  {/if}

  {#if error || description}
    <p class="ps-1 text-xs {error ? 'text-error font-medium' : 'opacity-40'}">
      {#if error}
        {error}
      {:else}
        {description}
      {/if}
    </p>
  {/if}
</div>
