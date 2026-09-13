import { computed, ref, type Ref } from 'vue'
import { useEventListener, useMutationObserver, useResizeObserver } from '@vueuse/core'

export function usePaginationPageTooltip(
  label: Readonly<Ref<HTMLElement | null>>,
  blocked: Readonly<Ref<boolean>>,
) {
  const content = ref('')

  function measure() {
    const element = label.value
    content.value =
      element && element.scrollWidth > element.clientWidth
        ? (element.textContent?.trim() ?? '')
        : ''
  }

  useResizeObserver(label, measure)
  useMutationObserver(label, measure, { childList: true, characterData: true, subtree: true })
  useEventListener(() => label.value?.ownerDocument.fonts, 'loadingdone', measure)

  return computed(() => (blocked.value ? false : content.value))
}
