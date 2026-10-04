import { getActiveElement, wrapArray } from '../roving-focus/utils'
import { isPointInPolygon, type Polygon } from '../utils/grace-area'

export type CheckedState = boolean | 'indeterminate'
export type Direction = 'ltr' | 'rtl'
export type Side = 'left' | 'right'

export interface GraceIntent {
  area: Polygon
  side: Side
}

export { getActiveElement, wrapArray }

export const ITEM_DATA_ATTR = 'data-radix-collection-item'
export const ITEM_SELECTOR = `[${ITEM_DATA_ATTR}]`
export const ENABLED_ITEM_SELECTOR = `${ITEM_SELECTOR}:not([data-disabled])`
export const CONTENT_ATTR = 'data-radix-menu-content'
export const ITEM_SELECT = 'menu.itemSelect'
export const ENTRY_FOCUS = 'rovingFocusGroup.onEntryFocus'
export const SELECTION_KEYS = ['Enter', ' ']
export const FIRST_KEYS = ['ArrowDown', 'PageUp', 'Home']
export const LAST_KEYS = ['ArrowUp', 'PageDown', 'End']
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS]
export const SUB_OPEN_KEYS: Record<Direction, string[]> = {
  ltr: [...SELECTION_KEYS, 'ArrowRight'],
  rtl: [...SELECTION_KEYS, 'ArrowLeft'],
}
export const SUB_CLOSE_KEYS: Record<Direction, string[]> = {
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

export function focusFirst(candidates: HTMLElement[]) {
  const previouslyFocused = getActiveElement()
  for (const candidate of candidates) {
    if (candidate === previouslyFocused) return
    candidate.focus()
    if (getActiveElement() !== previouslyFocused) return
  }
}

export function isPointerInGraceArea(event: { clientX: number; clientY: number }, area?: Polygon) {
  if (!area) return false
  return isPointInPolygon({ x: event.clientX, y: event.clientY }, area)
}

export function isMouseEvent(event: { pointerType: string }) {
  return event.pointerType === 'mouse'
}

export function isTouchOrPen(event: { pointerType: string }) {
  return event.pointerType !== 'mouse'
}

interface ArrowNavigationOptions {
  arrowKeyOptions?: 'horizontal' | 'vertical' | 'both'
  attributeName?: string
  loop?: boolean
  dir?: Direction
  preventScroll?: boolean
  focus?: boolean
}

function findNextFocusableElement(
  elements: HTMLElement[],
  currentElement: HTMLElement,
  options: { goForward: boolean; loop?: boolean },
  iterations = !elements.includes(currentElement) ? elements.length + 1 : elements.length,
): HTMLElement | null {
  if (--iterations === 0) return null
  const index = elements.indexOf(currentElement)
  const newIndex =
    index === -1
      ? options.goForward
        ? 0
        : elements.length - 1
      : index + (options.goForward ? 1 : -1)
  if (!options.loop && (newIndex < 0 || newIndex >= elements.length)) return null
  const candidate = elements[(newIndex + elements.length) % elements.length]
  if (!candidate) return null
  if (candidate.hasAttribute('disabled') && candidate.getAttribute('disabled') !== 'false')
    return findNextFocusableElement(elements, candidate, options, iterations)
  return candidate
}

export function arrowNavigation(
  event: { key: string; preventDefault: () => void },
  currentElement: HTMLElement | null,
  parentElement: HTMLElement | null | undefined,
  options: ArrowNavigationOptions = {},
): HTMLElement | null {
  if (!currentElement) return null
  const {
    arrowKeyOptions = 'both',
    attributeName = ITEM_SELECTOR,
    loop = true,
    dir = 'ltr',
    preventScroll = true,
    focus = false,
  } = options
  const right = event.key === 'ArrowRight'
  const left = event.key === 'ArrowLeft'
  const up = event.key === 'ArrowUp'
  const down = event.key === 'ArrowDown'
  const home = event.key === 'Home'
  const end = event.key === 'End'
  const goingVertical = up || down
  const goingHorizontal = right || left
  if (
    !home &&
    !end &&
    ((!goingVertical && !goingHorizontal) ||
      (arrowKeyOptions === 'vertical' && goingHorizontal) ||
      (arrowKeyOptions === 'horizontal' && goingVertical))
  )
    return null
  const items = parentElement
    ? Array.from(parentElement.querySelectorAll<HTMLElement>(attributeName))
    : []
  if (!items.length) return null
  if (preventScroll) event.preventDefault()
  let item: HTMLElement | null = null
  if (goingHorizontal || goingVertical) {
    const goForward = goingVertical ? down : dir === 'ltr' ? right : left
    item = findNextFocusableElement(items, currentElement, { goForward, loop })
  } else if (home) item = items.at(0) ?? null
  else if (end) item = items.at(-1) ?? null
  if (focus) item?.focus()
  return item
}

export function getNextMatch(values: string[], search: string, currentMatch?: string) {
  const isRepeated = search.length > 1 && Array.from(search).every(char => char === search[0])
  const normalizedSearch = isRepeated ? search[0]! : search
  const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1
  let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0))
  if (normalizedSearch.length === 1) wrappedValues = wrappedValues.filter(v => v !== currentMatch)
  const nextMatch = wrappedValues.find(value =>
    value.toLowerCase().startsWith(normalizedSearch.toLowerCase()),
  )
  return nextMatch !== currentMatch ? nextMatch : undefined
}

function isSelectableInput(element: unknown): element is HTMLInputElement {
  return element instanceof HTMLInputElement && 'select' in element
}

export function focusElement(element: HTMLElement | null | undefined, { select = false } = {}) {
  if (element && element.focus) {
    const previouslyFocused = getActiveElement()
    element.focus({ preventScroll: true })
    if (element !== previouslyFocused && isSelectableInput(element) && select) element.select()
  }
}

export function buttonAttributes(
  as: unknown,
  disabled?: boolean,
): { type?: string; disabled?: boolean } {
  return { type: as === 'button' ? 'button' : undefined, ...(disabled ? { disabled } : {}) }
}
