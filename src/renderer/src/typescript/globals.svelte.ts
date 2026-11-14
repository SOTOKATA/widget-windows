// globals.svelte.ts
import type { Settings } from './Settings'

interface GlobalsSvelte {
  settings: Settings
}

type SettingsListener = (newSettings: Settings) => void
const listeners: Set<SettingsListener> = new Set()

export function onSettingsUpdate(callback: SettingsListener) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

export const globals: GlobalsSvelte = $state({
  settings: await window.settingsAPI.get()
})

export async function refreshSettings(): Promise<void> {
  const newSettings = await window.settingsAPI.get()
  globals.settings = newSettings

  for (const listener of listeners)
    listener(newSettings)
}

if (window.settingsAPI?.onUpdated) {
  window.settingsAPI.onUpdated(async () => {
    await refreshSettings()
  })
}
