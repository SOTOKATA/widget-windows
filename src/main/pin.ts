// src/main/pin.js
import koffi from 'koffi'

const user32 = koffi.load('user32.dll')
const FindWindowW = user32.func('intptr_t __stdcall FindWindowW(str16 cls, str16 name)')
const SetWindowPos = user32.func(
  'bool __stdcall SetWindowPos(intptr_t hWnd, intptr_t after, int X, int Y, int cx, int cy, uint32_t flags)'
)

const SWP_NOSIZE = 0x1,
  SWP_NOMOVE = 0x2,
  SWP_NOACTIVATE = 0x10

function hwndOf(win) {
  const b = win.getNativeWindowHandle()
  return Number(b.length >= 8 ? b.readBigUInt64LE(0) : b.readUInt32LE(0))
}

export function pinToDesktop(win) {
  const sink = () => {
    if (win.isDestroyed()) return

    // вернуть окно, если Win+D его свернул или скрыл
    if (win.isMinimized() || !win.isVisible()) win.showInactive()

    // поставить прямо над окном рабочего стола
    const progman = FindWindowW('Progman', null)
    SetWindowPos(hwndOf(win), progman || 1, 0, 0, 0, 0, SWP_NOSIZE | SWP_NOMOVE | SWP_NOACTIVATE)
  }

  sink()
  win.on('minimize', sink)
  win.on('hide', sink)
  win.on('show', sink)
  const timer = setInterval(sink, 500) // подстраховка
  win.on('closed', () => clearInterval(timer))
}
