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

function block(event: Event) {
  event.preventDefault()
}

export function useLayerLock(viewport: ShallowRef<HTMLElement | undefined>) {
  const locked = useBodyPointerLock()
  let release: (() => void) | undefined

  function apply() {
    release?.()
    release = undefined
    const el = viewport.value
    if (!el || !locked.value || getComputedStyle(el).pointerEvents !== 'none') return
    el.addEventListener('wheel', block, { passive: false })
    el.addEventListener('touchmove', block, { passive: false })
    release = () => {
      el.removeEventListener('wheel', block)
      el.removeEventListener('touchmove', block)
    }
  }

  watch([locked, viewport], apply, { flush: 'post' })
  onBeforeUnmount(() => release?.())
}
