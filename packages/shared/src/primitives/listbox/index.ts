import { handleAndDispatchCustomEvent } from '../dismissable-layer'
import { getActiveElement } from '../focus-scope'
import { wrapArray, type FocusIntent } from '../roving-focus'
import { isEqual } from '../value'

export { isEqual }

export type Comparator<T = unknown> = string | ((a: T, b: T) => boolean)
export type ListboxSelectionBehavior = 'toggle' | 'replace'

export interface ListboxEntry<V = unknown> {
  ref: HTMLElement
  value?: V
}

export const LISTBOX_SELECT = 'listbox.select'

export type ListboxSelectEvent<T = unknown> = CustomEvent<{ originalEvent: Event; value: T }>

export function dispatchListboxSelect<T>(
  event: Event,
  value: T,
  callback: (event: ListboxSelectEvent<T>) => void,
) {
  handleAndDispatchCustomEvent<ListboxSelectEvent<T>>(LISTBOX_SELECT, callback, {
    originalEvent: event,
    value,
  })
}

export function compare<T>(
  value: T | undefined,
  currentValue: T | undefined,
  comparator?: Comparator<T>,
) {
  if (value === undefined || currentValue === undefined) return false
  if (typeof value === 'string') return value === currentValue
  if (typeof comparator === 'function') return comparator(value, currentValue)
  if (typeof comparator === 'string')
    return (
      (value as Record<string, unknown> | null)?.[comparator] ===
      (currentValue as Record<string, unknown> | null)?.[comparator]
    )
  return isEqual(value, currentValue)
}

export function valueComparator<T>(
  value: T | T[] | undefined,
  currentValue: T,
  comparator?: Comparator<T>,
) {
  if (value === undefined) return false
  if (Array.isArray(value)) return value.some(item => compare(item, currentValue, comparator))
  return compare(value as T, currentValue, comparator)
}

export function findValuesBetween<T>(array: T[], start: T, end: T) {
  const startIndex = array.findIndex(item => isEqual(item, start))
  const endIndex = array.findIndex(item => isEqual(item, end))
  if (startIndex === -1 || endIndex === -1) return []
  const [minIndex, maxIndex] = [startIndex, endIndex].sort((a, b) => a - b) as [number, number]
  return array.slice(minIndex, maxIndex + 1)
}

export function nextListboxValue<T>(
  model: T | T[] | undefined,
  value: T,
  options: { multiple: boolean; selectionBehavior: ListboxSelectionBehavior; by?: Comparator<T> },
): { value: T | T[] | undefined; anchor: boolean } {
  const { multiple, selectionBehavior, by } = options
  if (multiple) {
    if (selectionBehavior !== 'toggle') return { value: [value], anchor: true }
    const values = Array.isArray(model) ? [...model] : []
    const index = values.findIndex(item => compare(item, value, by))
    if (index === -1) values.push(value)
    else values.splice(index, 1)
    return { value: values, anchor: false }
  }
  if (selectionBehavior === 'toggle' && compare(model as T | undefined, value, by))
    return { value: undefined, anchor: false }
  return { value, anchor: false }
}

export function enabledListboxItems(items: HTMLElement[]) {
  return items.filter(item => item.dataset.disabled !== '')
}

export function listboxNavigation(
  items: HTMLElement[],
  current: HTMLElement | null | undefined,
  intent: FocusIntent,
) {
  let candidates = [...items]
  if (current) {
    if (intent === 'last') candidates.reverse()
    else if (intent === 'prev' || intent === 'next') {
      if (intent === 'prev') candidates.reverse()
      candidates = candidates.slice(candidates.indexOf(current) + 1)
    }
  }
  const target = candidates.length
    ? candidates[!current && intent === 'prev' ? candidates.length - 1 : 0]
    : undefined
  return { target, rangeTarget: current ? candidates[0] : undefined, extendsRange: !!current }
}

export function listboxRangeValues<V>(
  event: Pick<KeyboardEvent, 'key' | 'shiftKey' | 'altKey' | 'ctrlKey' | 'metaKey'>,
  items: ListboxEntry<V>[],
  target: HTMLElement | undefined,
  firstValue: V | undefined,
) {
  if ((event.altKey || event.ctrlKey || event.metaKey) && !event.shiftKey) return
  if (!event.shiftKey) return
  const enabled = items.filter(item => item.ref.dataset.disabled !== '')
  let lastValue = enabled.find(item => item.ref === target)?.value
  if (event.key === 'End') lastValue = enabled.at(-1)?.value
  else if (event.key === 'Home') lastValue = enabled[0]?.value
  if (!lastValue || !firstValue) return
  return findValuesBetween(
    enabled.map(item => item.value as V),
    firstValue,
    lastValue,
  )
}

export function listboxContentTabIndex(focusable: boolean, highlighted: boolean) {
  return focusable ? (highlighted ? '-1' : '0') : '-1'
}

export function listboxItemTabIndex(focusable: boolean, highlighted: boolean) {
  return focusable ? (highlighted ? '0' : '-1') : -1
}

export function ignoresListboxArrow(key: string, orientation: 'vertical' | 'horizontal') {
  return (
    (orientation === 'vertical' && (key === 'ArrowLeft' || key === 'ArrowRight')) ||
    (orientation === 'horizontal' && (key === 'ArrowUp' || key === 'ArrowDown'))
  )
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

export function createTypeahead(timeout = 1000) {
  let search = ''
  let timer: ReturnType<typeof setTimeout> | undefined
  function set(value: string) {
    search = value
    if (timer !== undefined) clearTimeout(timer)
    timer = setTimeout(() => {
      search = ''
      timer = undefined
    }, timeout)
  }
  return {
    get search() {
      return search
    },
    reset() {
      set('')
    },
    handle(key: string, items: { ref: HTMLElement; value?: unknown }[]) {
      set(search + key)
      const currentItem = getActiveElement()
      const itemsWithTextValue = items.map(item => ({
        ...item,
        textValue:
          (item.value as { textValue?: string } | null | undefined)?.textValue ??
          item.ref.textContent?.trim() ??
          '',
      }))
      const currentMatch = itemsWithTextValue.find(item => item.ref === currentItem)
      const values = itemsWithTextValue.map(item => item.textValue)
      const nextMatch = getNextMatch(values, search, currentMatch?.textValue)
      const newItem = itemsWithTextValue.find(item => item.textValue === nextMatch)
      if (newItem) newItem.ref.focus()
      return newItem?.ref
    },
    dispose() {
      if (timer !== undefined) clearTimeout(timer)
    },
  }
}

export type Typeahead = ReturnType<typeof createTypeahead>

export interface EventHook<T> {
  on: (listener: (value: T) => void) => { off: () => void }
  trigger: (value: T) => void
}

export function createEventHook<T>(): EventHook<T> {
  const listeners = new Set<(value: T) => void>()
  return {
    on(listener) {
      listeners.add(listener)
      return { off: () => listeners.delete(listener) }
    },
    trigger(value) {
      for (const listener of [...listeners]) listener(value)
    },
  }
}
