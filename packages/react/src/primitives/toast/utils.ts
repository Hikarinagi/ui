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

export function handleAndDispatchCustomEvent(
  name: string,
  target: HTMLElement,
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

function isHTMLElement(node: Node): node is HTMLElement {
  return node.nodeType === node.ELEMENT_NODE
}

export function getAnnounceTextContent(container: HTMLElement) {
  const textContent: string[] = []
  const childNodes = Array.from(container.childNodes)
  childNodes.forEach(node => {
    if (node.nodeType === node.TEXT_NODE && node.textContent) textContent.push(node.textContent)
    if (isHTMLElement(node)) {
      const isHidden = node.ariaHidden || node.hidden || node.style.display === 'none'
      const isExcluded = node.dataset.radixToastAnnounceExclude === ''
      if (!isHidden) {
        if (isExcluded) {
          const altText = node.dataset.radixToastAnnounceAlt
          if (altText) textContent.push(altText)
        } else textContent.push(...getAnnounceTextContent(node))
      }
    }
  })
  return textContent
}
