import { createMarkdownSettings, MarkdownSettings } from '@app-types/MarkdownSettings'

export interface Settings {
  autoLaunch: boolean
  bgTransparency: number
  removeBorder: boolean
  gridWidth: number
  gridHeight: number
  markdownSettings: MarkdownSettings
}

function makeClear(item: any): typeof item {
  if (!item) return item

  return JSON.parse(JSON.stringify(item))
}

export function createSettings(settings?: Partial<Settings>): Settings {
  return {
    autoLaunch: settings?.autoLaunch ?? false,
    bgTransparency: settings?.bgTransparency ?? 90,
    markdownSettings: makeClear(settings?.markdownSettings) ?? createMarkdownSettings(),
    removeBorder: settings?.removeBorder ?? false,
    gridWidth: settings?.gridWidth ?? 25,
    gridHeight: settings?.gridHeight ?? 15,
  }
}
