export function enableTyping(input: HTMLInputElement): void {
  window.widget.setFocusable(true);
  setTimeout(() => input?.focus(), 50)
}
