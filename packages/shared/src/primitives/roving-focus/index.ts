import { getActiveElement } from '../focus-scope'

export type Orientation = 'horizontal' | 'vertical'
export type Direction = 'ltr' | 'rtl'
export type FocusIntent = 'first' | 'last' | 'prev' | 'next'

export const ENTRY_FOCUS = 'rovingFocusGroup.onEntryFocus'
export const ENTRY_FOCUS_OPTIONS = { bubbles: false, cancelable: true }

const KEY_TO_INTENT: Record<string, FocusIntent> = {
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  ArrowRight: 'next',
  ArrowDown: 'next',
  PageUp: 'first',
  Home: 'first',
  PageDown: 'last',
  End: 'last',
}

export function getDirectionAwareKey(key: string, dir?: Direction) {
  if (dir !== 'rtl') return key
  return key === 'ArrowLeft' ? 'ArrowRight' : key === 'ArrowRight' ? 'ArrowLeft' : key
}

export function getFocusIntent(event: KeyboardEvent, orientation?: Orientation, dir?: Direction) {
  const key = getDirectionAwareKey(event.key, dir)
  if (orientation === 'vertical' && (key === 'ArrowLeft' || key === 'ArrowRight')) return undefined
  if (orientation === 'horizontal' && (key === 'ArrowUp' || key === 'ArrowDown')) return undefined
  return KEY_TO_INTENT[key]
}

export function focusFirstCandidate(candidates: HTMLElement[], preventScroll = false) {
  const previous = getActiveElement()
  for (const candidate of candidates) {
    if (candidate === previous) return
    candidate.focus({ preventScroll })
    if (getActiveElement() !== previous) return
  }
}

export function wrapArray<T>(array: T[], startIndex: number) {
  return array.map((_, index) => array[(startIndex + index) % array.length]!)
}
