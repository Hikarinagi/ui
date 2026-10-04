export function getActiveElement(): Element | null {
  let active = document.activeElement
  if (active == null) return null
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement
  return active
}

function isSelectableInput(element: unknown): element is HTMLInputElement {
  return element instanceof HTMLInputElement && 'select' in element
}

export function focus(element: Element | null | undefined, { select = false } = {}) {
  if (!element || !('focus' in element)) return
  const previous = getActiveElement()
  ;(element as HTMLElement).focus({ preventScroll: true })
  if (element !== previous && isSelectableInput(element) && select) element.select()
}

export function focusFirst(candidates: HTMLElement[], { select = false } = {}) {
  const previous = getActiveElement()
  for (const candidate of candidates) {
    focus(candidate, { select })
    if (getActiveElement() !== previous) return true
  }
  return false
}

export function getTabbableCandidates(container: HTMLElement) {
  const nodes: HTMLElement[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: node => {
      const element = node as HTMLInputElement
      const isHiddenInput = element.tagName === 'INPUT' && element.type === 'hidden'
      if (element.disabled || element.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP
      return element.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    },
  })
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement)
  return nodes
}
