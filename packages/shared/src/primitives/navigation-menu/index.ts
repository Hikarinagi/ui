import { getActiveElement } from '../focus-scope'

export type NavigationMenuAlign = 'start' | 'center' | 'end'

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

export interface MotionState {
  triggers: HTMLElement[]
  dir: 'ltr' | 'rtl'
  modelValue: string
  previousValue: string
  value: string
}

export function getMotionAttribute(state: MotionState) {
  const values = state.triggers.map(node => node.id.split('trigger-')[1])
  if (state.dir === 'rtl') values.reverse()
  const index = values.indexOf(state.modelValue)
  const prevIndex = values.indexOf(state.previousValue)
  const isSelected = state.value === state.modelValue
  const wasSelected = prevIndex === values.indexOf(state.value)
  if (!isSelected && !wasSelected) return undefined
  if (index !== prevIndex) {
    if (isSelected && prevIndex !== -1) return index > prevIndex ? 'from-end' : 'from-start'
    if (wasSelected && index !== -1) return index > prevIndex ? 'to-start' : 'to-end'
  }
  return null
}

export function getViewportPosition(
  root: HTMLElement,
  trigger: HTMLElement,
  content: HTMLElement,
  align: NavigationMenuAlign | string | undefined,
) {
  const bodyWidth = document.documentElement.offsetWidth
  const bodyHeight = document.documentElement.offsetHeight
  const rootRect = root.getBoundingClientRect()
  const rect = trigger.getBoundingClientRect()
  const { offsetWidth, offsetHeight } = content
  const startPositionLeft = rect.left - rootRect.left
  const startPositionTop = rect.top - rootRect.top
  let posLeft: number
  let posTop: number
  switch (align) {
    case 'start':
      posLeft = startPositionLeft
      posTop = startPositionTop
      break
    case 'end':
      posLeft = startPositionLeft - offsetWidth + rect.width
      posTop = startPositionTop - offsetHeight + rect.height
      break
    default:
      posLeft = startPositionLeft - offsetWidth / 2 + rect.width / 2
      posTop = startPositionTop - offsetHeight / 2 + rect.height / 2
  }
  const screenOffset = 10
  if (posLeft + rootRect.left < screenOffset) posLeft = screenOffset - rootRect.left
  const rightOffset = posLeft + rootRect.left + offsetWidth
  if (rightOffset > bodyWidth - screenOffset) {
    posLeft -= rightOffset - bodyWidth + screenOffset
    if (posLeft < screenOffset - rootRect.left) posLeft = screenOffset - rootRect.left
  }
  if (posTop + rootRect.top < screenOffset) posTop = screenOffset - rootRect.top
  const bottomOffset = posTop + rootRect.top + offsetHeight
  if (bottomOffset > bodyHeight - screenOffset) {
    posTop -= bottomOffset - bodyHeight + screenOffset
    if (posTop < screenOffset - rootRect.top) posTop = screenOffset - rootRect.top
  }
  return { left: Math.round(posLeft), top: Math.round(posTop) }
}
