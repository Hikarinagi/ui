import { computed, onMounted, ref, toValue, watch, watchEffect } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import type { ScrollTopProps } from '../types'

export function useScrollTop(props: ScrollTopProps) {
  const mounted = ref(false)
  const pastThreshold = ref(false)
  const keyboardFocused = ref(false)
  const reducedMotion = usePreferredReducedMotion()
  onMounted(() => {
    mounted.value = true
  })
  const target = computed(() => {
    if (!mounted.value) return undefined
    return props.target === undefined ? window : toValue(props.target)
  })
  const visible = computed(() => !!target.value && (pastThreshold.value || keyboardFocused.value))
  watch(target, () => {
    keyboardFocused.value = false
  })

  watchEffect(
    onCleanup => {
      const element = target.value
      const threshold = Number.isFinite(props.threshold) ? Math.max(0, props.threshold!) : 300
      pastThreshold.value = false
      if (!element) return
      const update = () => {
        pastThreshold.value =
          ('scrollY' in element ? element.scrollY : element.scrollTop) > threshold
      }
      update()
      element.addEventListener('scroll', update, { passive: true })
      onCleanup(() => element.removeEventListener('scroll', update))
    },
    { flush: 'post' },
  )

  function scrollToTop() {
    if (!target.value || props.disabled || props.loading) return
    target.value.scrollTo({
      top: 0,
      behavior: reducedMotion.value === 'reduce' ? 'instant' : (props.behavior ?? 'smooth'),
    })
    toValue(props.focusTarget)?.focus({ preventScroll: true })
  }
  function onFocus(event: FocusEvent) {
    keyboardFocused.value = (event.target as HTMLElement).matches(':focus-visible')
  }
  function onBlur() {
    keyboardFocused.value = false
  }
  return { visible, scrollToTop, onFocus, onBlur }
}
