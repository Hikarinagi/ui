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
    const sign = getComputedStyle(el).direction === 'rtl' ? -1 : 1
    const offset = Math.max(0, Math.min(max, el.scrollLeft * sign))
    const atStart = offset <= 1 && event.deltaY < 0
    const atEnd = offset >= max - 1 && event.deltaY > 0
    if (atStart || atEnd) return
    event.preventDefault()
    el.scrollLeft = (offset + event.deltaY) * sign
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
