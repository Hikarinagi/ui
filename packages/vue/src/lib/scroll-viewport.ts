import { computed, shallowRef } from 'vue'

export function useScrollViewport() {
  const scrollArea = shallowRef<{ viewport?: HTMLElement } | null>(null)
  const viewport = computed(() => scrollArea.value?.viewport)

  return { scrollArea, viewport }
}
