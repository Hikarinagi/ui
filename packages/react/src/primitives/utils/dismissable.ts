export type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>
export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

export function isLayerExist(layer: HTMLElement, target: EventTarget | null) {
  if (!(target instanceof Element)) return false
  const targetLayer = target.closest('[data-dismissable-layer]')
  const mainLayer =
    layer.dataset.dismissableLayer === '' ? layer : layer.querySelector('[data-dismissable-layer]')
  if (!targetLayer || !mainLayer) return false
  const layers = Array.from(layer.ownerDocument.querySelectorAll('[data-dismissable-layer]'))
  return mainLayer === targetLayer || layers.indexOf(mainLayer) < layers.indexOf(targetLayer)
}

export function guardLayer<E extends CustomEvent>(
  layer: () => HTMLElement | null,
  handler?: (event: E) => void,
) {
  return (event: E) => {
    const element = layer()
    if (element && isLayerExist(element, event.target)) {
      event.preventDefault()
      return
    }
    handler?.(event)
  }
}
