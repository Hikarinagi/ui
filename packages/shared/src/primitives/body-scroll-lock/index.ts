import { blockingLayerCount } from '../dismissable-layer'

export interface ScrollBodyOption {
  padding?: boolean | number | string
  margin?: boolean | number | string
}

export type ScrollBody = boolean | ScrollBodyOption

const locks = new Map<symbol, boolean>()
let initialOverflow: string | undefined
let releaseTouchMove: (() => void) | undefined
let active = false

const isIOS =
  typeof navigator !== 'undefined' &&
  (/iP(?:ad|hone|od)/.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 2 && /iPad|Macintosh/.test(navigator.userAgent)))

function scrollable(element: Element): boolean {
  const style = getComputedStyle(element)
  if (
    style.overflowX === 'scroll' ||
    style.overflowY === 'scroll' ||
    (style.overflowX === 'auto' && element.clientWidth < element.scrollWidth) ||
    (style.overflowY === 'auto' && element.clientHeight < element.scrollHeight)
  )
    return true
  const parent = element.parentNode
  if (!(parent instanceof Element) || parent.tagName === 'BODY') return false
  return scrollable(parent)
}

function preventTouchMove(event: TouchEvent) {
  const target = event.target
  if (target instanceof Element && scrollable(target)) return
  if (event.touches.length > 1) return
  if (event.cancelable) event.preventDefault()
}

function locked() {
  for (const value of locks.values()) if (value) return true
  return false
}

function size(value: boolean | number | string) {
  return typeof value === 'number' ? `${value}px` : String(value)
}

function offsets(scrollBody: ScrollBody, scrollbar: number) {
  if (!scrollBody) return { padding: 0, margin: 0 }
  if (typeof scrollBody !== 'object') return { padding: scrollbar, margin: 0 }
  const pick = (value: boolean | number | string | undefined, fallback: number) =>
    value === true ? scrollbar : (value ?? fallback)
  return { padding: pick(scrollBody.padding, scrollbar), margin: pick(scrollBody.margin, 0) }
}

function reset() {
  const body = document.body
  body.style.paddingRight = ''
  body.style.marginRight = ''
  if (blockingLayerCount() === 0) body.style.pointerEvents = ''
  document.documentElement.style.removeProperty('--scrollbar-width')
  body.style.overflow = initialOverflow ?? ''
  releaseTouchMove?.()
  releaseTouchMove = undefined
  initialOverflow = undefined
}

function apply(scrollBody: ScrollBody, defer: (callback: () => void) => void) {
  const body = document.body
  if (initialOverflow === undefined) initialOverflow = body.style.overflow
  const scrollbar = window.innerWidth - document.documentElement.clientWidth
  const { padding, margin } = offsets(scrollBody, scrollbar)
  if (scrollbar > 0) {
    body.style.paddingRight = size(padding)
    body.style.marginRight = size(margin)
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbar}px`)
    body.style.overflow = 'hidden'
  }
  if (isIOS) {
    document.addEventListener('touchmove', preventTouchMove, { passive: false })
    releaseTouchMove = () => document.removeEventListener('touchmove', preventTouchMove)
  }
  defer(() => {
    if (!locked()) return
    body.style.pointerEvents = 'none'
    body.style.overflow = 'hidden'
  })
}

function sync(scrollBody: ScrollBody, defer: (callback: () => void) => void) {
  const next = locked()
  if (next === active) return
  active = next
  if (next) apply(scrollBody, defer)
  else reset()
}

export function createScrollLock(
  scrollBody: () => ScrollBody,
  defer: (callback: () => void) => void = queueMicrotask,
) {
  const id = Symbol('scroll-lock')
  return {
    set(value: boolean) {
      locks.set(id, value)
      sync(scrollBody(), defer)
    },
    release() {
      locks.delete(id)
      sync(scrollBody(), defer)
    },
  }
}
