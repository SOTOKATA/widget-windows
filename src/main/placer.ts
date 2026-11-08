import { BrowserWindow, screen } from 'electron'

const MARGIN = 5

export function placeTopRight(win: BrowserWindow): void {
  const { x, y, width } = screen.getPrimaryDisplay().workArea
  const [w, h] = win.getSize()

  win.setBounds({ x: x + width - w - MARGIN, y: y + MARGIN, width: w, height: h })
}
