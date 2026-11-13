<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    children: Snippet
    type?: AlertType
  }

  let { children, type = 'neutral' }: Props = $props()

  type AlertType = 'success' | 'warning' | 'error' | 'neutral'

  const alerts: Record<AlertType, string> = {
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
    neutral: ''
  }
</script>

<div class="alert alert-soft px-3! py-2! rounded-md {alerts[type]}">
  <span>{@render children()}</span>
</div>
