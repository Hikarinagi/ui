import { shallowRef, watch, type Ref } from 'vue'
import {
  createOverlayReference,
  type OverlayAnchor,
  type OverlayPositionStrategy,
  type OverlayReference,
} from '../../../shared/src/lib/overlay-anchor'

export * from '../../../shared/src/lib/overlay-anchor'

export function useOverlayAnchor(
  source: () => OverlayAnchor | null | undefined,
  open: Ref<boolean | undefined>,
  present: Ref<boolean>,
  strategy: () => OverlayPositionStrategy,
  direction: () => 'ltr' | 'rtl' | undefined = () => undefined,
) {
  const reference = shallowRef<OverlayReference>()

  let current: OverlayAnchor | undefined

  watch(
    [source, open, present, strategy, direction],
    ([anchor, active, mounted]) => {
      if (!mounted) {
        current = undefined
        reference.value = undefined
        return
      }
      if (!anchor || (!active && reference.value && anchor !== current)) return
      const next = createOverlayReference(anchor, () => source() === anchor)
      if (!next) return
      current = anchor
      reference.value = next
    },
    { immediate: true, flush: 'post' },
  )

  return reference
}
