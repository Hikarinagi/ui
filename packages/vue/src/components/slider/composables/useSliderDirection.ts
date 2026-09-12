import { computed, shallowRef, watchEffect } from 'vue'
import { injectConfigProviderContext, type Direction } from 'reka-ui'

export function useSliderDirection(dir: () => Direction | undefined) {
  const root = shallowRef<HTMLElement>()
  const context = injectConfigProviderContext(null)
  const inherited = shallowRef<Direction>('ltr')
  const rootDirection = computed(() => dir() ?? context?.dir?.value)
  const direction = computed(() => rootDirection.value ?? inherited.value)

  watchEffect(
    onCleanup => {
      const element = root.value
      const view = element?.ownerDocument.defaultView
      if (!element || !view || rootDirection.value) return

      const update = () => {
        inherited.value = view.getComputedStyle(element).direction === 'rtl' ? 'rtl' : 'ltr'
      }

      update()
      const observer = new view.MutationObserver(update)
      for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement)
        observer.observe(ancestor, { attributes: true, attributeFilter: ['dir'] })
      onCleanup(() => observer.disconnect())
    },
    { flush: 'post' },
  )

  return { root, direction, rootDirection }
}
