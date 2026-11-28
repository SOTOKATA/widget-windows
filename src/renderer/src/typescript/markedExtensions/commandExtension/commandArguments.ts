export interface CommandArguments {
  args: string[]
  html: string
  setContent: (content: string) => boolean
  execute: (command: string) => string
  registerInterval?: (interval: ReturnType<typeof setInterval>) => void
}
