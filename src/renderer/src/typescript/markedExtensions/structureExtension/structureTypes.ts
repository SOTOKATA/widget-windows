import type { Component } from 'svelte'

export interface Option {
  name: string
  args: string[]
  body?: string
}

export interface StructureArguments {
  args: string[]
  options: Option[]
  parseMarkdown: (markdown: string) => string
}

export interface IComponentLink {
  component: Component<any>
  props?: Record<string, unknown>
}

export interface IStructure {
  name: string
  execute: (arguments_: StructureArguments) => string | IComponentLink
}
