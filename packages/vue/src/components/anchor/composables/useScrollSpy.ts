import { useIntersectionObserver } from '@vueuse/core'
import { computed, onMounted, shallowRef, watch } from 'vue'
import {
  SCROLL_SPY_OPTIONS,
  applyIntersections,
  coveredEntries,
  coveredSpan,
  hashTarget,
  jumpToAnchor,
  sameTargets,
  spyTargets,
  type SpyEntry,
} from '../../../../../shared/src/lib/anchor'

export type { SpyEntry }

export function useScrollSpy(entries: () => SpyEntry[]) {
  const visible = shallowRef<ReadonlySet<string>>(new Set())
  const targets = shallowRef<Array<HTMLElement | null>>([])
  const intersecting = new Set<string>()

  const covered = computed(() => coveredEntries(entries(), visible.value))
  const current = computed(() => covered.value[0]?.id)
  const span = computed(() => coveredSpan(entries(), visible.value))

  useIntersectionObserver(
    targets,
    observed => {
      visible.value = applyIntersections(intersecting, observed, current.value)
    },
    SCROLL_SPY_OPTIONS,
  )

  function locate() {
    intersecting.clear()
    targets.value = spyTargets(entries())
  }

  onMounted(() => {
    const hash = hashTarget(entries())
    if (hash) visible.value = new Set([hash])
    locate()
    watch(entries, (next, previous) => {
      if (sameTargets(next, previous)) return
      visible.value = new Set()
      locate()
    })
  })

  function jump(event: MouseEvent, id: string) {
    if (jumpToAnchor(event, id)) visible.value = new Set([id])
  }

  return { visible, covered, current, span, jump }
}
