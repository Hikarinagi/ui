import { getTabbableCandidates } from '../focus-scope'

export const TOAST_SWIPE_START = 'toast.swipeStart'
export const TOAST_SWIPE_MOVE = 'toast.swipeMove'
export const TOAST_SWIPE_CANCEL = 'toast.swipeCancel'
export const TOAST_SWIPE_END = 'toast.swipeEnd'
export const VIEWPORT_PAUSE = 'toast.viewportPause'
export const VIEWPORT_RESUME = 'toast.viewportResume'

export type SwipeDirection = 'up' | 'down' | 'left' | 'right'

export interface SwipeDetail {
  originalEvent: PointerEvent
  delta: { x: number; y: number }
}

export type SwipeEvent = CustomEvent<SwipeDetail> & { currentTarget: HTMLElement }

export function dispatchSwipeEvent(
  name: string,
  target: EventTarget,
  handler: ((event: SwipeEvent) => void) | undefined,
  detail: SwipeDetail,
) {
  const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail })
  if (handler) target.addEventListener(name, handler as unknown as EventListener, { once: true })
  target.dispatchEvent(event)
}

export function isDeltaInDirection(
  delta: { x: number; y: number },
  direction: SwipeDirection,
  threshold = 0,
) {
  const deltaX = Math.abs(delta.x)
  const deltaY = Math.abs(delta.y)
  const isDeltaX = deltaX > deltaY
  if (direction === 'left' || direction === 'right') return isDeltaX && deltaX > threshold
  return !isDeltaX && deltaY > threshold
}

export function swipeDelta(
  start: { x: number; y: number },
  point: { clientX: number; clientY: number },
  direction: SwipeDirection,
) {
  const x = point.clientX - start.x
  const y = point.clientY - start.y
  const isHorizontalSwipe = ['left', 'right'].includes(direction)
  const clamp = ['left', 'up'].includes(direction) ? Math.min : Math.max
  return {
    x,
    y,
    delta: { x: isHorizontalSwipe ? clamp(0, x) : 0, y: !isHorizontalSwipe ? clamp(0, y) : 0 },
  }
}

export function swipeStartBuffer(pointerType: string) {
  return pointerType === 'touch' ? 10 : 2
}

function isHTMLElement(node: Node): node is HTMLElement {
  return node.nodeType === node.ELEMENT_NODE
}

export function getAnnounceTextContent(container: HTMLElement, prefix: 'reka' | 'radix') {
  const textContent: string[] = []
  const childNodes = Array.from(container.childNodes)
  childNodes.forEach(node => {
    if (node.nodeType === node.TEXT_NODE && node.textContent) textContent.push(node.textContent)
    if (isHTMLElement(node)) {
      const isHidden = node.ariaHidden || node.hidden || node.style.display === 'none'
      const isExcluded = node.dataset[`${prefix}ToastAnnounceExclude`] === ''
      if (!isHidden) {
        if (isExcluded) {
          const altText = node.dataset[`${prefix}ToastAnnounceAlt`]
          if (altText) textContent.push(altText)
        } else textContent.push(...getAnnounceTextContent(node, prefix))
      }
    }
  })
  return textContent
}

export function hotkeyMessage(hotkey: string[]) {
  return hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, '')
}

export function viewportLabel(label: string | ((hotkey: string) => string), hotkey: string) {
  return typeof label === 'string' ? label.replace('{hotkey}', hotkey) : label(hotkey)
}

export function sortTabbableCandidates(
  toasts: HTMLElement[],
  tabbingDirection: 'forwards' | 'backwards',
) {
  const tabbableCandidates = toasts.map(toastNode => {
    const toastTabbableCandidates = [toastNode, ...getTabbableCandidates(toastNode)]
    return tabbingDirection === 'forwards'
      ? toastTabbableCandidates
      : toastTabbableCandidates.reverse()
  })
  return (
    tabbingDirection === 'forwards' ? tabbableCandidates.reverse() : tabbableCandidates
  ).flat()
}
