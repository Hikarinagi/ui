import { computed } from 'vue'
import type { AnchorItem, AnchorSlotItem } from '../types'
import { useScrollSpy } from './useScrollSpy'

export function useAnchor<T extends AnchorItem>(items: () => T[]) {
  const entries = computed(() =>
    items().flatMap(item => [
      { id: item.id, label: item.label, depth: 0, item: item as AnchorSlotItem<T> },
      ...(item.children ?? []).map(child => ({
        id: child.id,
        label: child.label,
        depth: 1,
        item: child as AnchorSlotItem<T>,
      })),
    ]),
  )

  return { entries, ...useScrollSpy(() => entries.value) }
}
