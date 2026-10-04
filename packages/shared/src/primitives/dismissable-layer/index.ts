export type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>
export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

export const POINTER_DOWN_OUTSIDE = 'dismissableLayer.pointerDownOutside'
export const FOCUS_OUTSIDE = 'dismissableLayer.focusOutside'

const layers = new Set<HTMLElement>()
const blocking = new Set<HTMLElement>()
const branches = new Set<HTMLElement>()
const listeners = new Set<() => void>()
let originalBodyPointerEvents: string | undefined
let version = 0

function changed() {
  version += 1
  for (const listener of listeners) listener()
}

export function subscribeLayers(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function layersVersion() {
  return version
}

export function addLayer(element: HTMLElement) {
  layers.add(element)
  changed()
  return () => {
    if (layers.delete(element)) changed()
  }
}

export function addBranch(element: HTMLElement) {
  branches.add(element)
  changed()
  return () => {
    if (branches.delete(element)) changed()
  }
}

export function blockOutsidePointerEvents(element: HTMLElement) {
  const body = element.ownerDocument.body
  if (blocking.size === 0) {
    originalBodyPointerEvents = body.style.pointerEvents
    body.style.pointerEvents = 'none'
  }
  blocking.add(element)
  changed()
  return () => {
    if (!blocking.delete(element)) return
    if (blocking.size === 0 && originalBodyPointerEvents != null)
      body.style.pointerEvents = originalBodyPointerEvents
    changed()
  }
}

export function releaseLayer(element: HTMLElement) {
  const removed = layers.delete(element)
  const unblocked = blocking.delete(element)
  if (removed || unblocked) changed()
}

export function blockingLayerCount() {
  return blocking.size
}

export function layerIndex(element: HTMLElement | null | undefined) {
  return element ? [...layers].indexOf(element) : -1
}

export function isHighestLayer(element: HTMLElement | null | undefined) {
  return layerIndex(element) === layers.size - 1
}

export function bodyPointerEventsDisabled() {
  return blocking.size > 0
}

export function pointerEventsEnabled(element: HTMLElement | null | undefined) {
  const highest = [...blocking].at(-1)
  return layerIndex(element) >= (highest ? [...layers].indexOf(highest) : -1)
}

export function layerPointerEvents(element: HTMLElement | null | undefined) {
  if (!bodyPointerEventsDisabled()) return undefined
  return pointerEventsEnabled(element) ? 'auto' : 'none'
}

export function inBranch(target: EventTarget | null) {
  return [...branches].some(branch => branch.contains(target as Node | null))
}

export function isLayerExist(layer: HTMLElement, target: EventTarget | null) {
  if (!(target instanceof Element)) return false
  const targetLayer = target.closest('[data-dismissable-layer]')
  const mainLayer =
    layer.dataset.dismissableLayer === ''
      ? layer
      : layer.querySelector<HTMLElement>('[data-dismissable-layer]')
  const all = Array.from(layer.ownerDocument.querySelectorAll('[data-dismissable-layer]'))
  return (
    !!targetLayer &&
    !!mainLayer &&
    (mainLayer === targetLayer || all.indexOf(mainLayer) < all.indexOf(targetLayer))
  )
}

export function handleAndDispatchCustomEvent<E extends CustomEvent<{ originalEvent: Event }>>(
  name: string,
  handler: ((event: E) => void) | undefined,
  detail: E['detail'],
) {
  const target = detail.originalEvent.target as EventTarget
  const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail })
  if (handler) target.addEventListener(name, handler as EventListener, { once: true })
  target.dispatchEvent(event)
}

export interface OutsideWatcher<E> {
  element: () => HTMLElement | null | undefined
  onOutside: (event: E) => void
}

export function watchPointerDownOutside({
  element,
  onOutside,
}: OutsideWatcher<PointerDownOutsideEvent>) {
  const ownerDocument = element()?.ownerDocument ?? globalThis.document
  let inside = false
  let pendingClick: () => void = () => {}

  const handlePointerDown = (event: PointerEvent) => {
    const layer = element()
    const target = event.target as HTMLElement | null
    if (!layer || !target) return
    if (isLayerExist(layer, target)) {
      inside = false
      return
    }
    if (!inside) {
      const dispatch = () =>
        handleAndDispatchCustomEvent(POINTER_DOWN_OUTSIDE, onOutside, { originalEvent: event })
      if (event.pointerType === 'touch') {
        ownerDocument.removeEventListener('click', pendingClick)
        pendingClick = dispatch
        ownerDocument.addEventListener('click', pendingClick, { once: true })
      } else dispatch()
    } else ownerDocument.removeEventListener('click', pendingClick)
    inside = false
  }

  const timer = window.setTimeout(() => {
    ownerDocument.addEventListener('pointerdown', handlePointerDown)
  }, 0)

  return {
    onPointerDownCapture() {
      inside = true
    },
    stop() {
      window.clearTimeout(timer)
      ownerDocument.removeEventListener('pointerdown', handlePointerDown)
      ownerDocument.removeEventListener('click', pendingClick)
    },
  }
}

export function watchFocusOutside({
  element,
  onOutside,
  settle,
}: OutsideWatcher<FocusOutsideEvent> & { settle?: () => Promise<void> }) {
  const ownerDocument = element()?.ownerDocument ?? globalThis.document
  let inside = false

  const handleFocus = async (event: FocusEvent) => {
    if (!element()) return
    if (settle) await settle()
    const layer = element()
    const target = event.target as HTMLElement | null
    if (!layer || !target || isLayerExist(layer, target)) return
    if (!inside) handleAndDispatchCustomEvent(FOCUS_OUTSIDE, onOutside, { originalEvent: event })
  }

  ownerDocument.addEventListener('focusin', handleFocus)

  return {
    onFocusCapture() {
      inside = true
    },
    onBlurCapture() {
      inside = false
    },
    stop() {
      ownerDocument.removeEventListener('focusin', handleFocus)
    },
  }
}
