export {
  compare,
  createEventHook,
  createTypeahead,
  findValuesBetween,
  getNextMatch,
  isEqual,
  valueComparator,
  type Comparator,
  type EventHook,
  type Typeahead,
} from '../../../../shared/src/primitives/listbox'

export interface CollectionEntry<V = unknown> {
  ref: HTMLElement
  value: V
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
