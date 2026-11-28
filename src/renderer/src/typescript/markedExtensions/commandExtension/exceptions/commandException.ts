export class InvalidArgumentException extends Error {
  constructor(command: string, argCount: number, options?: ErrorOptions) {
    super(`Invalid arguments for command "${command}" required: ${argCount}`, options)
    this.name = 'InvalidArgumentException'
  }
}
