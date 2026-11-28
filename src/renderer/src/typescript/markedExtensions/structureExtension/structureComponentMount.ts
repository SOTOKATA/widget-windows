import { mount, unmount } from 'svelte'
import type { IComponentLink } from './structureTypes'

const componentLinks = new Map<string, IComponentLink>()

export function registerStructureComponent(id: string, link: IComponentLink): void {
  componentLinks.set(id, link)
}

export function mountStructureComponents(root: HTMLElement): () => void {
  const mounted = new Map<HTMLElement, () => void>()

  const scan = () => {
    for (const [element, dispose] of mounted) {
      if (!element.isConnected || !root.contains(element)) {
        dispose()
        mounted.delete(element)
      }
    }

    for (const host of root.querySelectorAll<HTMLElement>('[data-structure-component]')) {
      if (mounted.has(host)) continue

      const id = host.dataset.structureComponent
      const link = id ? componentLinks.get(id) : undefined
      if (!id || !link) continue

      componentLinks.delete(id)
      const instance = mount(link.component, { target: host, props: link.props ?? {} })
      mounted.set(host, () => {
        void unmount(instance)
      })
    }
  }

  const observer = new MutationObserver(scan)
  observer.observe(root, { childList: true, subtree: true })
  scan()

  return () => {
    observer.disconnect()

    for (const dispose of mounted.values()) dispose()
    mounted.clear()
  }
}
