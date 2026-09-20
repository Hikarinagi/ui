import { shallowRef, watch, type Ref } from 'vue'

export type OverlayAnchor =
  | HTMLElement
  | {
      getBoundingClientRect: () => Pick<
        DOMRect,
        'x' | 'y' | 'width' | 'height' | 'top' | 'right' | 'bottom' | 'left'
      >
      contextElement?: Element
    }
export type OverlayPositionStrategy = 'optimized' | 'always'

export function overlayAnchorElement(anchor?: OverlayAnchor | null): HTMLElement | undefined {
  return anchor && 'nodeType' in anchor ? anchor : undefined
}

export function overlayAnchorContext(anchor?: OverlayAnchor | null): Element | undefined {
  return (
    overlayAnchorElement(anchor) ??
    (anchor && 'contextElement' in anchor ? anchor.contextElement : undefined)
  )
}

export function useOverlayAnchor(
  source: () => OverlayAnchor | null | undefined,
  open: Ref<boolean | undefined>,
  present: Ref<boolean>,
  strategy: () => OverlayPositionStrategy,
  direction: () => 'ltr' | 'rtl' | undefined = () => undefined,
) {
  const reference = shallowRef<Exclude<OverlayAnchor, HTMLElement>>()

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
      const contextElement = overlayAnchorContext(anchor)
      if (contextElement && !contextElement.isConnected) return
      current = anchor
      const measure = () => {
        const { x, y, width, height, top, right, bottom, left } = anchor.getBoundingClientRect()
        return { x, y, width, height, top, right, bottom, left }
      }
      let rect = measure()
      reference.value = {
        contextElement,
        getBoundingClientRect: () => {
          if (source() === anchor && (!contextElement || contextElement.isConnected))
            rect = measure()
          return rect
        },
      }
    },
    { immediate: true, flush: 'post' },
  )

  return reference
}
