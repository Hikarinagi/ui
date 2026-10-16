import { isPointInPolygon, type Polygon } from '../grace-area'

export type CheckedState = boolean | 'indeterminate'
export type MenuDirection = 'ltr' | 'rtl'
export type GraceSide = 'left' | 'right'

export interface GraceIntent {
  area: Polygon
  side: GraceSide
}

export const ITEM_SELECT = 'menu.itemSelect'
export const SELECTION_KEYS = ['Enter', ' ']
export const FIRST_KEYS = ['ArrowDown', 'PageUp', 'Home']
export const LAST_KEYS = ['ArrowUp', 'PageDown', 'End']
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS]
export const SUB_OPEN_KEYS: Record<MenuDirection, string[]> = {
  ltr: [...SELECTION_KEYS, 'ArrowRight'],
  rtl: [...SELECTION_KEYS, 'ArrowLeft'],
}
export const SUB_CLOSE_KEYS: Record<MenuDirection, string[]> = {
  ltr: ['ArrowLeft'],
  rtl: ['ArrowRight'],
}

export function getOpenState(open: boolean) {
  return open ? 'open' : 'closed'
}

export function isIndeterminate(checked?: CheckedState): checked is 'indeterminate' {
  return checked === 'indeterminate'
}

export function getCheckedState(checked: CheckedState) {
  return isIndeterminate(checked) ? 'indeterminate' : checked ? 'checked' : 'unchecked'
}

export function isPointerInGraceArea(event: { clientX: number; clientY: number }, area?: Polygon) {
  if (!area) return false
  return isPointInPolygon({ x: event.clientX, y: event.clientY }, area)
}

export function isMouseEvent(event: { pointerType: string }) {
  return event.pointerType === 'mouse'
}

export function submenuGraceIntent(
  event: { clientX: number; clientY: number },
  contentRect: { left: number; right: number; top: number; bottom: number },
  side: GraceSide,
): GraceIntent {
  const rightSide = side === 'right'
  const bleed = rightSide ? -5 : +5
  const contentNearEdge = contentRect[rightSide ? 'left' : 'right']
  const contentFarEdge = contentRect[rightSide ? 'right' : 'left']
  return {
    area: [
      { x: event.clientX + bleed, y: event.clientY },
      { x: contentNearEdge, y: contentRect.top },
      { x: contentFarEdge, y: contentRect.top },
      { x: contentFarEdge, y: contentRect.bottom },
      { x: contentNearEdge, y: contentRect.bottom },
    ],
    side,
  }
}
