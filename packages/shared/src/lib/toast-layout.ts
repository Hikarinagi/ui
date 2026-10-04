export const VISIBLE_STACK = 3

export const TOAST_GAP = 12

export const TOAST_CARD_CHROME_BLOCK = 34

export interface ToastSlot {
  index: number
  offset: number
}

export function toastLayout(
  open: readonly { id: number | string }[],
  heightOf: (id: number | string) => number | undefined,
) {
  const map = new Map<number | string, ToastSlot>()
  let offset = 0
  for (let i = open.length - 1; i >= 0; i -= 1) {
    const item = open[i]!
    const index = open.length - 1 - i
    map.set(item.id, { index, offset })
    offset += (heightOf(item.id) ?? 0) + TOAST_GAP
  }
  return map
}

export function toastItemStyle(
  slot: ToastSlot,
  selfHeight: number | undefined,
  frontHeight: number,
): Record<string, string> {
  return {
    '--hn-t-index': String(slot.index),
    '--hn-t-offset': `${slot.offset}px`,
    ...(selfHeight ? { '--hn-t-self-h': `${selfHeight}px` } : {}),
    ...(frontHeight > 0 ? { '--hn-t-front-h': `${frontHeight}px` } : {}),
  }
}

export function toastCardHeight(body: HTMLElement) {
  return body.offsetHeight + TOAST_CARD_CHROME_BLOCK
}
