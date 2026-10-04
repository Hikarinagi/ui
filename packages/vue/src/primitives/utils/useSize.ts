import { computed, onMounted, onUnmounted, ref, type MaybeRefOrGetter } from 'vue'
import { unrefElement, type MaybeElement } from '@vueuse/core'
import { measureSize, observeSize, type Size } from '../../../../shared/src/primitives/size'

export function useSize(element: MaybeRefOrGetter<MaybeElement>) {
  const size = ref<Size>()
  const width = computed(() => size.value?.width ?? 0)
  const height = computed(() => size.value?.height ?? 0)
  let dispose: (() => void) | undefined

  onMounted(() => {
    const target = unrefElement(element) as HTMLElement | undefined
    if (target) {
      size.value = measureSize(target)
      dispose = observeSize(target, next => (size.value = next))
    } else size.value = undefined
  })

  onUnmounted(() => {
    dispose?.()
    dispose = undefined
  })

  return { width, height }
}
