import { watch, type ShallowRef } from 'vue'

export function useWheelRedirect(
  viewport: ShallowRef<HTMLElement | undefined>,
  enabled: () => boolean,
) {
  function onWheel(event: WheelEvent) {
    if (event.defaultPrevented || !enabled()) return
    const el = viewport.value
    if (!el) return
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
    const max = el.scrollWidth - el.clientWidth
    if (max <= 0) return
    const atStart = el.scrollLeft <= 0 && event.deltaY < 0
    const atEnd = el.scrollLeft >= max - 1 && event.deltaY > 0
    if (atStart || atEnd) return
    event.preventDefault()
    el.scrollLeft += event.deltaY
  }

  watch(
    viewport,
    (el, _, onCleanup) => {
      if (!el) return
      el.addEventListener('wheel', onWheel, { passive: false })
      onCleanup(() => el.removeEventListener('wheel', onWheel))
    },
    { immediate: true },
  )
}
