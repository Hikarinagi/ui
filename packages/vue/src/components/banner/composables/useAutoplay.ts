import { useDocumentVisibility, useIntervalFn, useMediaQuery } from '@vueuse/core'
import { computed, onMounted, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

export function useAutoplay(
  interval: MaybeRefOrGetter<number | undefined>,
  enabled: MaybeRefOrGetter<boolean>,
  tick: () => void,
) {
  const hovered = ref(false)
  const focused = ref(false)
  const visibility = useDocumentVisibility()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const active = computed(
    () =>
      toValue(enabled) &&
      (toValue(interval) ?? 0) > 0 &&
      !hovered.value &&
      !focused.value &&
      visibility.value !== 'hidden' &&
      !reducedMotion.value,
  )

  const timer = useIntervalFn(tick, () => toValue(interval) ?? 0, { immediate: false })

  onMounted(() => {
    watch(active, value => (value ? timer.resume() : timer.pause()), { immediate: true })
  })

  return { hovered, focused, active }
}
