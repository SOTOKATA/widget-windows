import { calendarStructure } from './calendarStructure'
import type { IStructure } from './structureTypes'

export const structures: IStructure[] = [calendarStructure]

export function registerStructure(structure: IStructure): void {
  const existingIndex = structures.findIndex((item) => item.name === structure.name)

  if (existingIndex === -1) {
    structures.push(structure)
  } else {
    structures[existingIndex] = structure
  }
}
