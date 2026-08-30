import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { prefersReducedMotion } from '../../../motion'

export interface SpyEntry {
  id: string
  label: string
  depth: number
}

export function useScrollSpy(entries: () => SpyEntry[]) {
  const visible = shallowRef<ReadonlySet<string>>(new Set())
  const linkEls = new Map<string, HTMLElement>()

  function setLink(id: string, el: unknown) {
    if (el) linkEls.set(id, el as HTMLElement)
    else linkEls.delete(id)
  }

  const covered = computed(() => entries().filter(entry => visible.value.has(entry.id)))
  const current = computed(() => covered.value[0]?.id)
  const rangeStart = computed(() =>
    covered.value.length ? (linkEls.get(covered.value[0]!.id) ?? null) : null,
  )
  const rangeEnd = computed(() =>
    covered.value.length ? (linkEls.get(covered.value.at(-1)!.id) ?? null) : null,
  )

  let spy: IntersectionObserver | undefined

  function targetOf(id: string) {
    return document.getElementById(id)
  }

  function observeAll() {
    spy?.disconnect()
    spy = new IntersectionObserver(
      observed => {
        const next = new Set(visible.value)
        for (const entry of observed) {
          if (entry.isIntersecting) next.add(entry.target.id)
          else next.delete(entry.target.id)
        }
        visible.value = next
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    for (const { id } of entries()) {
      const el = targetOf(id)
      if (el) spy.observe(el)
    }
  }

  onMounted(() => {
    observeAll()
    watch(entries, () => {
      visible.value = new Set()
      observeAll()
    })
  })

  onBeforeUnmount(() => spy?.disconnect())

  function jump(event: MouseEvent, id: string) {
    const el = targetOf(id)
    if (!el) return
    event.preventDefault()
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(history.state, '', `#${id}`)
    visible.value = new Set([id])
  }

  return { setLink, visible, covered, current, rangeStart, rangeEnd, jump }
}
