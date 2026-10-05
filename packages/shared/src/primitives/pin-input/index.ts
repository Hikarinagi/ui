import { arrowNavigation } from '../arrow-navigation'

export type PinInputValue = Array<string | number | undefined>

const NUMBER = /^\d*$/
const NON_NUMBER = /\D/g
const NAVIGATION_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']

export function pinInputValues(value: unknown): PinInputValue {
  return Array.isArray(value) ? [...value] : []
}

export function isPinInputComplete(values: PinInputValue, count: number, numeric: boolean) {
  return values.filter(value => !!value || (numeric && value === 0)).length === count
}

export function stripPinNonNumbers(value: string) {
  return value.replace(NON_NUMBER, '')
}

function removeTrailingEmptyStrings(values: PinInputValue) {
  while (values.length && values[values.length - 1] === '') values.pop()
  return values
}

export function setPinValueAt(
  current: PinInputValue,
  index: number,
  value: string,
  numeric: boolean,
) {
  const values = [...current]
  if (numeric) {
    const number = +value
    if (value === '' || Number.isNaN(number)) delete values[index]
    else values[index] = number
  } else values[index] = value
  return removeTrailingEmptyStrings(values)
}

export function spreadPinValue(
  current: PinInputValue,
  characters: string,
  index: number,
  count: number,
  numeric: boolean,
) {
  const values = [...current]
  const start = characters.length >= count ? 0 : index
  const end = Math.min(start + characters.length, count)
  const filled: number[] = []
  for (let at = start; at < end; at++) {
    const character = characters[at - start]!
    if (numeric) {
      const number = Number.parseInt(character)
      if (Number.isNaN(number)) continue
      values[at] = number
    } else values[at] = character
    filled.push(at)
  }
  return { values, filled, end }
}

export type PinTextAction =
  | { kind: 'clear' }
  | { kind: 'filter'; value: string }
  | { kind: 'spread'; characters: string }
  | { kind: 'single'; character: string }

export function resolvePinComposition(value: string, numeric: boolean): PinTextAction {
  const text = numeric ? stripPinNonNumbers(value) : value
  if (numeric && !text) return { kind: 'clear' }
  if (text.length > 1) return { kind: 'spread', characters: text }
  return { kind: 'single', character: text }
}

export function resolvePinInput(
  data: string | null | undefined,
  value: string,
  numeric: boolean,
): PinTextAction {
  if ((data?.length ?? 0) > 1) return { kind: 'spread', characters: value }
  if (numeric && !NUMBER.test(value)) return { kind: 'filter', value: stripPinNonNumbers(value) }
  return { kind: 'single', character: data || value.slice(-1) }
}

export function resolvePinPaste(text: string, numeric: boolean) {
  return numeric ? stripPinNonNumbers(text) : text
}

export function pinFocusRedirect(values: PinInputValue, count: number, index: number) {
  for (let at = 0; at < count; at++)
    if (values[at] === '' || values[at] === undefined) return at < index ? at : -1
  return -1
}

export function isPinNavigationKey(key: string) {
  return NAVIGATION_KEYS.includes(key)
}

export function navigatePin(
  event: KeyboardEvent,
  current: HTMLElement | null,
  inputs: HTMLElement[],
  dir: 'ltr' | 'rtl',
) {
  arrowNavigation(event, current, undefined, {
    itemsArray: inputs,
    focus: true,
    loop: false,
    arrowKeyOptions: 'horizontal',
    dir,
  })
}

export function pinPlaceholder(
  element: HTMLInputElement,
  active: Element | null,
  placeholder: string,
) {
  element.placeholder = !element.value && element === active ? '' : placeholder
}

export function pinInputLabel(index: number, count: number) {
  return `pin input ${index + 1} of ${count}`
}
