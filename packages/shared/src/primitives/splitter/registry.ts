import { getResizeEventCoordinates } from './events'
import { intersects } from './rects'
import { compare } from './stackingOrder'
import { resetGlobalCursorStyle, setGlobalCursorStyle } from './style'
import type {
  Direction,
  PointerHitAreaMargins,
  ResizeEvent,
  ResizeHandlerAction,
  SetResizeHandlerState,
} from './types'

export {
  EXCEEDED_HORIZONTAL_MAX,
  EXCEEDED_HORIZONTAL_MIN,
  EXCEEDED_VERTICAL_MAX,
  EXCEEDED_VERTICAL_MIN,
} from './flags'

interface ResizeHandlerData {
  direction: () => Direction
  element: HTMLElement
  hitAreaMargins: PointerHitAreaMargins
  nonce: () => string | undefined
  setResizeHandlerState: SetResizeHandlerState
}

function getInputType() {
  if (typeof matchMedia === 'function')
    return matchMedia('(pointer:coarse)').matches ? 'coarse' : 'fine'
}

const isCoarsePointer = getInputType() === 'coarse'
const intersectingHandles: ResizeHandlerData[] = []
let isPointerDown = false
const ownerDocumentCounts = new Map<Document, number>()
const panelConstraintFlags = new Map<string, number>()
const registeredResizeHandlers = new Set<ResizeHandlerData>()

export function registerResizeHandle(
  resizeHandleId: string,
  element: HTMLElement,
  direction: () => Direction,
  hitAreaMargins: PointerHitAreaMargins,
  nonce: () => string | undefined,
  setResizeHandlerState: SetResizeHandlerState,
) {
  const { ownerDocument } = element
  const data: ResizeHandlerData = {
    direction,
    element,
    hitAreaMargins,
    nonce,
    setResizeHandlerState,
  }
  const count = ownerDocumentCounts.get(ownerDocument) ?? 0
  ownerDocumentCounts.set(ownerDocument, count + 1)
  registeredResizeHandlers.add(data)
  updateListeners()
  return function unregisterResizeHandle() {
    panelConstraintFlags.delete(resizeHandleId)
    registeredResizeHandlers.delete(data)
    const count = ownerDocumentCounts.get(ownerDocument) ?? 1
    ownerDocumentCounts.set(ownerDocument, count - 1)
    updateListeners()
    resetGlobalCursorStyle()
    if (count === 1) ownerDocumentCounts.delete(ownerDocument)
  }
}

function handlePointerDown(event: ResizeEvent) {
  const { target } = event
  const { x, y } = getResizeEventCoordinates(event)
  isPointerDown = true
  recalculateIntersectingHandles({ target, x, y })
  updateListeners()
  if (intersectingHandles.length > 0) {
    updateResizeHandlerStates('down', event)
    event.preventDefault()
  }
}

function handlePointerMove(event: ResizeEvent) {
  const { x, y } = getResizeEventCoordinates(event)
  if (!isPointerDown) {
    const { target } = event
    recalculateIntersectingHandles({ target, x, y })
  }
  updateResizeHandlerStates('move', event)
  updateCursor()
  if (intersectingHandles.length > 0) event.preventDefault()
}

function handlePointerUp(event: ResizeEvent) {
  const { target } = event
  const { x, y } = getResizeEventCoordinates(event)
  panelConstraintFlags.clear()
  isPointerDown = false
  if (intersectingHandles.length > 0) event.preventDefault()
  updateResizeHandlerStates('up', event)
  recalculateIntersectingHandles({ target, x, y })
  updateCursor()
  updateListeners()
}

function recalculateIntersectingHandles({
  target,
  x,
  y,
}: {
  target: EventTarget | null
  x: number
  y: number
}) {
  intersectingHandles.splice(0)
  let targetElement: HTMLElement | null = null
  if (target instanceof HTMLElement) targetElement = target
  registeredResizeHandlers.forEach(data => {
    const { element: dragHandleElement, hitAreaMargins } = data
    const dragHandleRect = dragHandleElement.getBoundingClientRect()
    const { bottom, left, right, top } = dragHandleRect
    const margin = isCoarsePointer ? hitAreaMargins.coarse : hitAreaMargins.fine
    const eventIntersects =
      x >= left - margin && x <= right + margin && y >= top - margin && y <= bottom + margin
    if (eventIntersects) {
      if (
        targetElement !== null &&
        dragHandleElement !== targetElement &&
        !dragHandleElement.contains(targetElement) &&
        !targetElement.contains(dragHandleElement) &&
        compare(targetElement, dragHandleElement) > 0
      ) {
        let currentElement: HTMLElement | null = targetElement
        let didIntersect = false
        while (currentElement) {
          if (currentElement.contains(dragHandleElement)) {
            break
          } else if (intersects(currentElement.getBoundingClientRect(), dragHandleRect, true)) {
            didIntersect = true
            break
          }
          currentElement = currentElement.parentElement
        }
        if (didIntersect) return
      }
      intersectingHandles.push(data)
    }
  })
}

export function reportConstraintsViolation(resizeHandleId: string, flag: number) {
  panelConstraintFlags.set(resizeHandleId, flag)
}

function updateCursor() {
  let intersectsHorizontal = false
  let intersectsVertical = false
  let nonce: string | undefined
  intersectingHandles.forEach(data => {
    const { direction, nonce: getNonce } = data
    if (direction() === 'horizontal') intersectsHorizontal = true
    else intersectsVertical = true
    nonce = getNonce()
  })
  let constraintFlags = 0
  panelConstraintFlags.forEach(flag => {
    constraintFlags |= flag
  })
  if (intersectsHorizontal && intersectsVertical)
    setGlobalCursorStyle('intersection', constraintFlags, nonce)
  else if (intersectsHorizontal) setGlobalCursorStyle('horizontal', constraintFlags, nonce)
  else if (intersectsVertical) setGlobalCursorStyle('vertical', constraintFlags, nonce)
  else resetGlobalCursorStyle()
}

const listener = {
  down: handlePointerDown as EventListener,
  move: handlePointerMove as EventListener,
  up: handlePointerUp as EventListener,
}

function updateListeners() {
  ownerDocumentCounts.forEach((_, ownerDocument) => {
    const { body } = ownerDocument
    body.removeEventListener('contextmenu', listener.up)
    body.removeEventListener('mousedown', listener.down)
    body.removeEventListener('mouseleave', listener.move)
    body.removeEventListener('mousemove', listener.move)
    body.removeEventListener('touchmove', listener.move)
    body.removeEventListener('touchstart', listener.down)
  })
  window.removeEventListener('mouseup', listener.up)
  window.removeEventListener('touchcancel', listener.up)
  window.removeEventListener('touchend', listener.up)
  if (registeredResizeHandlers.size > 0) {
    if (isPointerDown) {
      if (intersectingHandles.length > 0) {
        ownerDocumentCounts.forEach((count, ownerDocument) => {
          const { body } = ownerDocument
          if (count > 0) {
            body.addEventListener('contextmenu', listener.up)
            body.addEventListener('mouseleave', listener.move)
            body.addEventListener('mousemove', listener.move)
            body.addEventListener('touchmove', listener.move, { passive: false })
          }
        })
      }
      window.addEventListener('mouseup', listener.up)
      window.addEventListener('touchcancel', listener.up)
      window.addEventListener('touchend', listener.up)
    } else {
      ownerDocumentCounts.forEach((count, ownerDocument) => {
        const { body } = ownerDocument
        if (count > 0) {
          body.addEventListener('mousedown', listener.down)
          body.addEventListener('mousemove', listener.move)
          body.addEventListener('touchmove', listener.move, { passive: false })
          body.addEventListener('touchstart', listener.down)
        }
      })
    }
  }
}

function updateResizeHandlerStates(action: ResizeHandlerAction, event: ResizeEvent) {
  registeredResizeHandlers.forEach(data => {
    const { setResizeHandlerState } = data
    const isActive = intersectingHandles.includes(data)
    setResizeHandlerState(action, isActive, event)
  })
}
