import type { Extension } from '@codemirror/state'
import { EditorView } from 'codemirror'
import { keymap } from '@codemirror/view'

export function editorZoom(initialSize = 14, min = 8, max = 36): Extension {
  let currentSize = initialSize

  const applySize = (view: EditorView, newSize: number): void => {
    currentSize = Math.min(max, Math.max(min, newSize))
    view.dom.style.setProperty('--editor-font-size', `${currentSize}px`)
    view.requestMeasure()
  }

  return [
    EditorView.domEventHandlers({
      wheel(event, view) {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          const delta = event.deltaY < 0 ? 1 : -1
          applySize(view, currentSize + delta)
          return true
        }
        return false
      }
    }),

    keymap.of([
      {
        key: 'Mod-=',
        run: (view) => {
          applySize(view, currentSize + 1)
          return true
        }
      },
      {
        key: 'Mod-+',
        run: (view) => {
          applySize(view, currentSize + 1)
          return true
        }
      },
      {
        key: 'Mod--',
        run: (view) => {
          applySize(view, currentSize - 1)
          return true
        }
      },
      {
        key: 'Mod-0',
        run: (view) => {
          applySize(view, initialSize)
          return true
        }
      }
    ])
  ]
}
