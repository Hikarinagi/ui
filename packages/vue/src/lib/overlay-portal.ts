import { computed, shallowRef, type ComponentPublicInstance, type Ref } from 'vue'

export function useOverlayPortal(open: Ref<boolean | undefined>) {
  const content = shallowRef<ComponentPublicInstance | null>(null)
  const present = computed(() => !!open.value || !!content.value)

  return { content, present }
}
