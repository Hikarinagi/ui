import { createSharedComposable, useMutationObserver } from '@vueuse/core'
import { onBeforeUnmount, ref, watch, type ShallowRef } from 'vue'
import { blockWhenInert } from '../../../../../shared/src/lib/scroll-area'

const useBodyPointerLock = createSharedComposable(() => {
  const locked = ref(false)
  if (typeof document !== 'undefined') {
    const read = () => {
      locked.value = document.body.style.pointerEvents === 'none'
    }
    read()
    useMutationObserver(document.body, read, { attributes: true, attributeFilter: ['style'] })
  }
  return locked
})

export function useLayerLock(viewport: ShallowRef<HTMLElement | undefined>) {
  const locked = useBodyPointerLock()
  let release: (() => void) | undefined

  function apply() {
    release?.()
    release = undefined
    const el = viewport.value
    if (!el || !locked.value) return
    release = blockWhenInert(el)
  }

  watch([locked, viewport], apply, { flush: 'post' })
  onBeforeUnmount(() => release?.())
}
