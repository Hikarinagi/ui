export type ScrollDirection = 'vertical' | 'horizontal' | 'both'

export interface ScrollEdges {
  xStart: boolean
  xEnd: boolean
  yStart: boolean
  yEnd: boolean
}

const NONE: ScrollEdges = { xStart: false, xEnd: false, yStart: false, yEnd: false }

export function scrollEdges(
  element: HTMLElement | undefined | null,
  direction: ScrollDirection,
  shadow: boolean,
): ScrollEdges {
  if (!element || !shadow) return NONE
  const room = 1
  const x = direction !== 'vertical'
  const y = direction !== 'horizontal'
  return {
    xStart: x && Math.abs(element.scrollLeft) > room,
    xEnd: x && Math.abs(element.scrollLeft) + element.clientWidth < element.scrollWidth - room,
    yStart: y && element.scrollTop > room,
    yEnd: y && element.scrollTop + element.clientHeight < element.scrollHeight - room,
  }
}

export function redirectWheel(element: HTMLElement, event: WheelEvent) {
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
  const max = element.scrollWidth - element.clientWidth
  if (max <= 0) return
  const sign = getComputedStyle(element).direction === 'rtl' ? -1 : 1
  const offset = Math.max(0, Math.min(max, element.scrollLeft * sign))
  const atStart = offset <= 1 && event.deltaY < 0
  const atEnd = offset >= max - 1 && event.deltaY > 0
  if (atStart || atEnd) return
  event.preventDefault()
  element.scrollLeft = (offset + event.deltaY) * sign
}

export function blockWhenInert(element: HTMLElement) {
  const block = (event: Event) => {
    if (getComputedStyle(element).pointerEvents === 'none') event.preventDefault()
  }
  element.addEventListener('wheel', block, { passive: false, capture: true })
  element.addEventListener('touchmove', block, { passive: false, capture: true })
  return () => {
    element.removeEventListener('wheel', block, true)
    element.removeEventListener('touchmove', block, true)
  }
}

export const SCROLL_AREA_OVERFLOW = {
  vertical: { x: 'hidden', y: 'scroll' },
  horizontal: { x: 'scroll', y: 'hidden' },
  both: { x: 'scroll', y: 'scroll' },
} as const

export function scrollAreaOptions(options: {
  direction: ScrollDirection
  autoHide: 'never' | 'scroll' | 'leave' | 'move'
  scrollbar: boolean
}) {
  return {
    scrollbars: {
      theme: 'os-theme-dark',
      visibility: options.scrollbar ? ('auto' as const) : ('hidden' as const),
      autoHide: options.autoHide,
      autoHideDelay: 800,
    },
    overflow: SCROLL_AREA_OVERFLOW[options.direction],
    update: {
      elementEvents: [['img', 'load']] as Array<[string, string]>,
    },
  }
}
