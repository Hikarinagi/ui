import { watch, type ShallowRef } from 'vue'
import { redirectWheel } from '../../../../../shared/src/lib/scroll-area'

export function useWheelRedirect(
  viewport: ShallowRef<HTMLElement | undefined>,
  enabled: () => boolean,
) {
  function onWheel(event: WheelEvent) {
    if (event.defaultPrevented || !enabled()) return
    const el = viewport.value
    if (!el) return
    redirectWheel(el, event)
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
