export const COLLECTION_ITEM = 'data-reka-collection-item'

export interface CollectionEntry {
  ref: HTMLElement
}

export function orderCollectionItems<T extends CollectionEntry>(
  root: HTMLElement | null | undefined,
  items: Iterable<T>,
  includeDisabled = false,
) {
  if (!root) return []
  const nodes = Array.from(root.querySelectorAll(`[${COLLECTION_ITEM}]`))
  const order = new Map(nodes.map((node, index) => [node, index]))
  const ordered = Array.from(items).sort(
    (a, b) => (order.get(a.ref) ?? -1) - (order.get(b.ref) ?? -1),
  )
  return includeDisabled ? ordered : ordered.filter(item => item.ref.dataset.disabled !== '')
}
