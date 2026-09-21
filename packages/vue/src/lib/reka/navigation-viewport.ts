import { ref, shallowRef, watch } from 'vue'
import { useMutationObserver } from '@vueuse/core'

export function useRekaNavigationViewport() {
  const viewport = shallowRef<HTMLElement>()
  const ready = ref(false)

  function update() {
    const style = viewport.value?.style
    ready.value = ['width', 'height', 'left', 'top'].every(dimension =>
      Number.isFinite(
        Number.parseFloat(
          style?.getPropertyValue(`--reka-navigation-menu-viewport-${dimension}`) ?? '',
        ),
      ),
    )
  }

  watch(viewport, update, { flush: 'post' })
  useMutationObserver(viewport, update, { attributes: true, attributeFilter: ['style'] })

  return { viewport, ready }
}
