import { useIntersectionObserver } from '@vueuse/core'
import { computed, onMounted, shallowRef, watch } from 'vue'
import { prefersReducedMotion } from '../../../motion'

export interface SpyEntry {
  id: string
  label: string
  depth: number
}

export function useScrollSpy(entries: () => SpyEntry[]) {
  const visible = shallowRef<ReadonlySet<string>>(new Set())
  const targets = shallowRef<Array<HTMLElement | null>>([])
  const intersecting = new Set<string>()

  const covered = computed(() => entries().filter(entry => visible.value.has(entry.id)))
  const current = computed(() => covered.value[0]?.id)
  const span = computed(() => {
    const rows = entries().flatMap((entry, index) => (visible.value.has(entry.id) ? [index] : []))
    return rows.length ? `${rows[0]! + 1} / ${rows.at(-1)! + 2}` : undefined
  })

  useIntersectionObserver(
    targets,
    observed => {
      for (const entry of observed) {
        if (entry.isIntersecting && entry.intersectionRatio > 0) intersecting.add(entry.target.id)
        else intersecting.delete(entry.target.id)
      }
      visible.value = intersecting.size
        ? new Set(intersecting)
        : new Set(current.value ? [current.value] : [])
    },
    { rootMargin: '0px 0px -15% 0px', threshold: [0, Number.EPSILON] },
  )

  function targetOf(id: string) {
    return document.getElementById(id)
  }

  function locate() {
    intersecting.clear()
    targets.value = entries().map(({ id }) => targetOf(id))
  }

  onMounted(() => {
    const hash = decodeURIComponent(location.hash.slice(1))
    if (hash && entries().some(entry => entry.id === hash)) visible.value = new Set([hash])
    locate()
    watch(entries, (next, previous) => {
      if (
        next.length === previous.length &&
        next.every((entry, index) => entry.id === previous[index]?.id)
      )
        return
      visible.value = new Set()
      locate()
    })
  })

  function jump(event: MouseEvent, id: string) {
    const el = targetOf(id)
    if (!el) return
    event.preventDefault()
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(history.state, '', `#${id}`)
    visible.value = new Set([id])
  }

  return { visible, covered, current, span, jump }
}
