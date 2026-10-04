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
export type OverlayReference = Exclude<OverlayAnchor, HTMLElement>

export function overlayAnchorElement(anchor?: OverlayAnchor | null): HTMLElement | undefined {
  return anchor && 'nodeType' in anchor ? anchor : undefined
}

export function overlayAnchorContext(anchor?: OverlayAnchor | null): Element | undefined {
  return (
    overlayAnchorElement(anchor) ??
    (anchor && 'contextElement' in anchor ? anchor.contextElement : undefined)
  )
}

export function createOverlayReference(
  anchor: OverlayAnchor,
  current: () => boolean,
): OverlayReference | undefined {
  const contextElement = overlayAnchorContext(anchor)
  if (contextElement && !contextElement.isConnected) return undefined
  const measure = () => {
    const { x, y, width, height, top, right, bottom, left } = anchor.getBoundingClientRect()
    return { x, y, width, height, top, right, bottom, left }
  }
  let rect = measure()
  return {
    contextElement,
    getBoundingClientRect: () => {
      if (current() && (!contextElement || contextElement.isConnected)) rect = measure()
      return rect
    },
  }
}
