import { computed, shallowRef, watch, type Ref } from 'vue'
import { useEventListener, useResizeObserver } from '@vueuse/core'

export function useTableText(element: Ref<HTMLElement | undefined>, value: () => string | number) {
  const overflow = shallowRef(false)
  const measure = () => {
    overflow.value = !!element.value && element.value.scrollWidth > element.value.clientWidth
  }
  useResizeObserver(element, measure)
  useEventListener(() => element.value?.ownerDocument.fonts, 'loadingdone', measure)
  watch(value, measure, { flush: 'post' })
  return { overflow, tooltip: computed(() => (overflow.value ? String(value()) : false)) }
}
