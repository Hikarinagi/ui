import { computed } from 'vue'
import { anchorEntries } from '../../../../../shared/src/lib/anchor'
import type { AnchorItem } from '../types'
import { useScrollSpy } from './useScrollSpy'

export function useAnchor<T extends AnchorItem>(items: () => T[]) {
  const entries = computed(() => anchorEntries(items()))

  return { entries, ...useScrollSpy(() => entries.value) }
}
