import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'

export function getOpenState(open: boolean) {
  return open ? 'open' : 'closed'
}

export function makeTriggerId(baseId: string, value: string) {
  return `${baseId}-trigger-${value}`
}

export function makeContentId(baseId: string, value: string) {
  return `${baseId}-content-${value}`
}

export const LINK_SELECT = 'navigationMenu.linkSelect'
export const EVENT_ROOT_CONTENT_DISMISS = 'navigationMenu.rootContentDismiss'

export function getTabbableCandidates(container: HTMLElement) {
  const nodes: HTMLElement[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: node => {
      const element = node as HTMLElement & { disabled?: boolean; type?: string }
      const isHiddenInput = element.tagName === 'INPUT' && element.type === 'hidden'
      if (element.disabled || element.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP
      return element.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    },
  })
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement)
  return nodes
}

export function focusFirst(candidates: HTMLElement[]) {
  const previouslyFocusedElement = getActiveElement()
  return candidates.some(candidate => {
    if (candidate === previouslyFocusedElement) return true
    candidate.focus()
    return getActiveElement() !== previouslyFocusedElement
  })
}

export function removeFromTabOrder(candidates: HTMLElement[]) {
  candidates.forEach(candidate => {
    candidate.dataset.tabindex = candidate.getAttribute('tabindex') || ''
    candidate.setAttribute('tabindex', '-1')
  })
  return () => {
    candidates.forEach(candidate => {
      const prevTabIndex = candidate.dataset.tabindex
      candidate.setAttribute('tabindex', prevTabIndex!)
    })
  }
}

export function whenMouse<E extends PointerEvent>(handler: (event: E) => void) {
  return (event: E) => (event.pointerType === 'mouse' ? handler(event) : undefined)
}
