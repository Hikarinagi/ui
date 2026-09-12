import { createSharedComposable, useMutationObserver } from '@vueuse/core'
import { onBeforeUnmount, ref, watch, type ShallowRef } from 'vue'

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
    const block = (event: Event) => {
      if (getComputedStyle(el).pointerEvents === 'none') event.preventDefault()
    }
    el.addEventListener('wheel', block, { passive: false, capture: true })
    el.addEventListener('touchmove', block, { passive: false, capture: true })
    release = () => {
      el.removeEventListener('wheel', block, true)
      el.removeEventListener('touchmove', block, true)
    }
  }

  watch([locked, viewport], apply, { flush: 'post' })
  onBeforeUnmount(() => release?.())
}
