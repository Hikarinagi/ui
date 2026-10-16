import { compare, type Comparator } from '../listbox'

export const OPEN_KEYS = [' ', 'Enter', 'ArrowUp', 'ArrowDown']
export const SELECTION_KEYS = [' ', 'Enter']
export const CONTENT_MARGIN = 10
export const SELECT_SELECT = 'select.select'

export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined
}

export function shouldShowPlaceholder(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  )
}

export function toggleSelectValue<T>(current: unknown, value: T, by?: Comparator<T>) {
  const array = Array.isArray(current) ? [...(current as T[])] : []
  const index = array.findIndex(item => compare(item, value, by))
  if (index === -1) array.push(value)
  else array.splice(index, 1)
  return [...array]
}

export function selectNavigationCandidates(
  items: HTMLElement[],
  key: string,
  target: EventTarget | null,
) {
  if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return null
  let candidateNodes = [...items]
  if (['ArrowUp', 'End'].includes(key)) candidateNodes = candidateNodes.slice().reverse()
  if (['ArrowUp', 'ArrowDown'].includes(key)) {
    const currentIndex = candidateNodes.indexOf(target as HTMLElement)
    candidateNodes = candidateNodes.slice(currentIndex + 1)
  }
  return candidateNodes
}

export interface TriggerReleaseOptions {
  content: HTMLElement
  origin: () => { x: number; y: number } | null | undefined
  onOutsideRelease: () => void
  onRelease: () => void
}

export function trackTriggerRelease(options: TriggerReleaseOptions) {
  let pointerMoveDelta = { x: 0, y: 0 }
  const handlePointerMove = (event: PointerEvent) => {
    const origin = options.origin()
    pointerMoveDelta = {
      x: Math.abs(Math.round(event.pageX) - (origin?.x ?? 0)),
      y: Math.abs(Math.round(event.pageY) - (origin?.y ?? 0)),
    }
  }
  const handlePointerUp = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) event.preventDefault()
    else if (!options.content.contains(event.target as Node)) options.onOutsideRelease()
    document.removeEventListener('pointermove', handlePointerMove)
    options.onRelease()
  }
  if (options.origin() !== null) {
    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp, { capture: true, once: true })
  }
  return () => {
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp, { capture: true })
  }
}

export function createSelectedItemTracker() {
  let firstValidItemFound = false
  let firstSelectedItemInArrayFound = false
  return {
    item(isSelected: boolean, disabled: boolean | undefined, multiple: boolean) {
      const isFirstValidItem = !firstValidItemFound && !disabled
      let picked = false
      if (multiple) {
        if (firstSelectedItemInArrayFound) return false
        if (isSelected || isFirstValidItem) {
          picked = true
          if (isSelected) firstSelectedItemInArrayFound = true
        }
      } else if (isSelected || isFirstValidItem) picked = true
      if (isFirstValidItem) firstValidItemFound = true
      return picked
    },
    text(isSelected: boolean, disabled: boolean | undefined) {
      return isSelected || (!firstValidItemFound && !disabled)
    },
  }
}
