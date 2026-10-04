import { kbd } from './utils'

export function isSegmentNavigationKey(key: string) {
  return key === kbd.ARROW_RIGHT || key === kbd.ARROW_LEFT
}

export function isNumberString(value: string) {
  return !Number.isNaN(Number.parseInt(value))
}

export function isAcceptableSegmentKey(key: string) {
  const acceptableSegmentKeys: string[] = [
    kbd.ENTER,
    kbd.ARROW_UP,
    kbd.ARROW_DOWN,
    kbd.ARROW_LEFT,
    kbd.ARROW_RIGHT,
    kbd.BACKSPACE,
    kbd.SPACE,
    'a',
    'A',
    'p',
    'P',
  ]
  if (acceptableSegmentKeys.includes(key)) return true
  return isNumberString(key)
}

export function getSegmentElements(parentElement: HTMLElement | null) {
  if (!parentElement) return []
  return Array.from(
    parentElement.querySelectorAll<HTMLElement>('[data-radix-date-field-segment]'),
  ).filter(item => item.getAttribute('data-radix-date-field-segment') !== 'literal')
}

export function getTimeFieldSegmentElements(parentElement: HTMLElement | null) {
  if (!parentElement) return []
  return Array.from(
    parentElement.querySelectorAll<HTMLElement>('[data-radix-time-field-segment]'),
  ).filter(item => item.getAttribute('data-radix-time-field-segment') !== 'literal')
}
