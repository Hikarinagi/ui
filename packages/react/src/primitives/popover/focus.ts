function isSelectableInput(element: unknown): element is HTMLInputElement {
  return element instanceof HTMLInputElement && 'select' in element
}

export function focus(element: HTMLElement | null | undefined, { select = false } = {}) {
  if (element && element.focus) {
    const previouslyFocusedElement = document.activeElement
    element.focus({ preventScroll: true })
    if (element !== previouslyFocusedElement && isSelectableInput(element) && select)
      element.select()
  }
}

export function getTabbableCandidates(container: HTMLElement) {
  const nodes: HTMLElement[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: Element) => {
      const element = node as HTMLElement & { disabled?: boolean; type?: string }
      const isHiddenInput = element.tagName === 'INPUT' && element.type === 'hidden'
      if (element.disabled || element.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP
      return element.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    },
  })
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement)
  return nodes
}

export function focusFirst(candidates: HTMLElement[], { select = false } = {}) {
  const previouslyFocusedElement = document.activeElement
  for (const candidate of candidates) {
    focus(candidate, { select })
    if (document.activeElement !== previouslyFocusedElement) return true
  }
  return false
}

export function autoFocusWithin(container: HTMLElement) {
  const previouslyFocusedElement = document.activeElement
  focusFirst(getTabbableCandidates(container), { select: true })
  if (document.activeElement === previouslyFocusedElement) focus(container)
}
