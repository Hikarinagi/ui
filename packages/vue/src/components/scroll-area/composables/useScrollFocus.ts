import { computed, nextTick, watch, type ShallowRef } from 'vue'

export function useScrollFocus(
  host: ShallowRef<HTMLElement | undefined>,
  viewport: ShallowRef<HTMLElement | undefined>,
  options: () => { focusable: boolean; label: string },
) {
  function attributes(enabled: boolean) {
    const { focusable, label } = options()
    return {
      tabindex: enabled && focusable ? 0 : undefined,
      role: enabled && focusable ? 'region' : undefined,
      'aria-label': enabled && focusable ? label : undefined,
    }
  }

  const hostFocus = computed(() => attributes(!viewport.value))
  const viewportFocus = computed(() => attributes(!!viewport.value))

  watch(
    viewport,
    async element => {
      const target = host.value
      if (!element || !target || !options().focusable) return
      if (target.ownerDocument.activeElement !== target) return
      await nextTick()
      const active = target.ownerDocument.activeElement
      if (
        options().focusable &&
        element.isConnected &&
        (active === target || active === target.ownerDocument.body)
      )
        element.focus({ preventScroll: true })
    },
    { flush: 'sync' },
  )

  return { hostFocus, viewportFocus }
}
