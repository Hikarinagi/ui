import { useEventListener } from '@vueuse/core'
import { computed, ref, type Ref } from 'vue'

export function useSliderChrome(disabled: Ref<boolean>, label: Ref<'auto' | 'always' | 'none'>) {
  const dragging = ref(false)
  const hovered = ref(false)
  const ring = ref(false)
  let pointer = false

  const labelOpen = computed(
    () =>
      label.value === 'always' ||
      (!disabled.value && (hovered.value || ring.value || dragging.value)),
  )

  function release() {
    dragging.value = false
  }

  useEventListener(['pointerup', 'pointercancel'], release, { passive: true })

  function onPointerDown(event: PointerEvent) {
    pointer = true
    if (disabled.value) return
    const root = event.currentTarget as HTMLElement
    if (!root.firstElementChild?.contains(event.target as Node)) return
    dragging.value = true
  }

  function onFocusIn() {
    ring.value = !pointer
    pointer = false
  }

  const listeners = {
    keydown: () => (ring.value = true),
    focusin: onFocusIn,
    focusout: () => (ring.value = false),
    pointerenter: (event: PointerEvent) => (hovered.value = event.pointerType === 'mouse'),
    pointerleave: () => (hovered.value = false),
  }

  return { dragging, hovered, ring, labelOpen, onPointerDown, listeners }
}
