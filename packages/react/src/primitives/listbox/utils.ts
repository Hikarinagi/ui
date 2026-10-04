export type Comparator = string | ((a: unknown, b: unknown) => boolean)

function serialize(value: unknown): string {
  if (typeof value === 'string') return `'${value}'`
  if (value === null || typeof value !== 'object') return String(value)
  if (Array.isArray(value)) return `[${value.map(serialize).join(',')}]`
  return `{${Object.keys(value)
    .sort()
    .map(key => `${key}:${serialize((value as Record<string, unknown>)[key])}`)
    .join(',')}}`
}

export function isEqual(a: unknown, b: unknown) {
  return a === b || serialize(a) === serialize(b)
}

export function compare(value: unknown, currentValue: unknown, comparator?: Comparator) {
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

export function valueComparator(value: unknown, currentValue: unknown, comparator?: Comparator) {
  if (value === undefined) return false
  if (Array.isArray(value)) return value.some(item => compare(item, currentValue, comparator))
  return compare(value, currentValue, comparator)
}

export function findValuesBetween<T>(array: T[], start: T, end: T) {
  const startIndex = array.findIndex(item => isEqual(item, start))
  const endIndex = array.findIndex(item => isEqual(item, end))
  if (startIndex === -1 || endIndex === -1) return []
  const [minIndex, maxIndex] = [startIndex, endIndex].sort((a, b) => a - b) as [number, number]
  return array.slice(minIndex, maxIndex + 1)
}

export function wrapArray<T>(array: T[], startIndex: number) {
  return array.map((_, index) => array[(startIndex + index) % array.length]!)
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

export interface CollectionEntry<V = unknown> {
  ref: HTMLElement
  value: V
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
    handle(key: string, items: CollectionEntry[]) {
      set(search + key)
      const currentItem = document.activeElement
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

export const COLLECTION_ITEM = 'data-radix-collection-item'

export function createCollection<V>() {
  const items = new Map<HTMLElement, V>()
  let root: HTMLElement | null = null
  return {
    setRoot(element: HTMLElement | null) {
      root = element
    },
    register(element: HTMLElement, value: V) {
      items.set(element, value)
      return () => {
        if (items.get(element) === value) items.delete(element)
      }
    },
    getItems(includeDisabledItem = false): CollectionEntry<V>[] {
      if (!root) return []
      const ordered = Array.from(root.querySelectorAll<HTMLElement>(`[${COLLECTION_ITEM}]`))
      const order = new Map(ordered.map((node, index) => [node, index]))
      const sorted = [...items.entries()]
        .map(([ref, value]) => ({ ref, value }))
        .sort((a, b) => (order.get(a.ref) ?? -1) - (order.get(b.ref) ?? -1))
      return includeDisabledItem ? sorted : sorted.filter(item => item.ref.dataset.disabled !== '')
    },
  }
}

export type Collection<V> = ReturnType<typeof createCollection<V>>
