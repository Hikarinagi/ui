export const AUTOFOCUS_ON_MOUNT = 'focusScope.autoFocusOnMount'
export const AUTOFOCUS_ON_UNMOUNT = 'focusScope.autoFocusOnUnmount'
const EVENT_OPTIONS = { bubbles: false, cancelable: true }

type FocusableTarget = HTMLElement | { focus: (options?: FocusOptions) => void }

export interface FocusScopeAPI {
  paused: boolean
  pause: () => void
  resume: () => void
}

export function createFocusScopeAPI(onChange?: () => void): FocusScopeAPI {
  return {
    paused: false,
    pause() {
      this.paused = true
      onChange?.()
    },
    resume() {
      this.paused = false
      onChange?.()
    },
  }
}

let stack: FocusScopeAPI[] = []

function without<T>(array: T[], item: T) {
  return array.filter(entry => entry !== item)
}

export const focusScopesStack = {
  add(scope: FocusScopeAPI) {
    const active = stack[0]
    if (scope !== active) active?.pause()
    stack = without(stack, scope)
    stack.unshift(scope)
  },
  remove(scope: FocusScopeAPI) {
    stack = without(stack, scope)
    stack[0]?.resume()
  },
}

export function getActiveElement(): Element | null {
  let active = document.activeElement
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement
  return active ?? null
}

export function isSelectableInput(
  element: unknown,
): element is HTMLInputElement & { select: () => void } {
  return element instanceof HTMLInputElement && 'select' in element
}

export function focus(element?: FocusableTarget | null, { select = false } = {}) {
  if (!element?.focus) return
  const previous = getActiveElement()
  element.focus({ preventScroll: true })
  if (element !== previous && isSelectableInput(element) && select) element.select()
}

export function focusFirst(candidates: HTMLElement[], { select = false } = {}) {
  const previous = getActiveElement()
  for (const candidate of candidates) {
    focus(candidate, { select })
    if (getActiveElement() !== previous) return true
  }
}

export function getTabbableCandidates(container: HTMLElement) {
  const nodes: HTMLElement[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: node => {
      const element = node as HTMLInputElement
      const hiddenInput = element.tagName === 'INPUT' && element.type === 'hidden'
      if (element.disabled || element.hidden || hiddenInput) return NodeFilter.FILTER_SKIP
      return element.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    },
  })
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement)
  return nodes
}

export function isHidden(node: HTMLElement, { upTo }: { upTo?: HTMLElement }) {
  if (getComputedStyle(node).visibility === 'hidden') return true
  let current: HTMLElement | null = node
  while (current) {
    if (upTo !== undefined && current === upTo) return false
    if (getComputedStyle(current).display === 'none') return true
    current = current.parentElement
  }
  return false
}

export function findVisible(elements: HTMLElement[], container: HTMLElement) {
  return elements.find(element => !isHidden(element, { upTo: container }))
}

export function getTabbableEdges(container: HTMLElement) {
  const candidates = getTabbableCandidates(container)
  return [
    findVisible(candidates, container),
    findVisible([...candidates].reverse(), container),
  ] as const
}

export function removeLinks(items: HTMLElement[]) {
  return items.filter(item => item.tagName !== 'A')
}

export function trapFocus(container: HTMLElement, scope: FocusScopeAPI) {
  let lastFocused: HTMLElement | null = null

  const handleFocusIn = (event: FocusEvent) => {
    if (scope.paused) return
    const target = event.target as HTMLElement | null
    if (container.contains(target)) lastFocused = target
    else focus(lastFocused, { select: true })
  }

  const handleFocusOut = (event: FocusEvent) => {
    if (scope.paused) return
    const related = event.relatedTarget as HTMLElement | null
    if (related === null) return
    if (!container.contains(related)) focus(lastFocused, { select: true })
  }

  const handleMutations = (mutations: MutationRecord[]) => {
    if (lastFocused === null) return
    if (!mutations.some(mutation => mutation.removedNodes.length > 0)) return
    const active = getActiveElement()
    if (active && container.contains(active)) return
    if (!container.contains(lastFocused)) focus(container)
  }

  document.addEventListener('focusin', handleFocusIn)
  document.addEventListener('focusout', handleFocusOut)
  const observer = new MutationObserver(handleMutations)
  observer.observe(container, { childList: true, subtree: true })

  return () => {
    document.removeEventListener('focusin', handleFocusIn)
    document.removeEventListener('focusout', handleFocusOut)
    observer.disconnect()
  }
}

export function dispatchMountAutoFocus(
  container: HTMLElement,
  previous: Element | null,
  onMountAutoFocus?: (event: Event) => void,
) {
  const event = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS)
  const handler = (mountEvent: Event) => onMountAutoFocus?.(mountEvent)
  container.addEventListener(AUTOFOCUS_ON_MOUNT, handler)
  container.dispatchEvent(event)
  container.removeEventListener(AUTOFOCUS_ON_MOUNT, handler)
  if (!event.defaultPrevented) {
    focusFirst(getTabbableCandidates(container), { select: true })
    if (getActiveElement() === previous) focus(container)
  }
}

export function dispatchUnmountAutoFocus(
  container: HTMLElement,
  previous: Element | null,
  scope: FocusScopeAPI,
  onUnmountAutoFocus?: (event: Event) => void,
) {
  const event = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS)
  const handler = (unmountEvent: Event) => onUnmountAutoFocus?.(unmountEvent)
  container.addEventListener(AUTOFOCUS_ON_UNMOUNT, handler)
  container.dispatchEvent(event)
  container.setAttribute('data-focus-scope-unmounting', '')
  setTimeout(() => {
    if (!event.defaultPrevented)
      focus((previous as HTMLElement | null) ?? document.body, { select: true })
    container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, handler)
    focusScopesStack.remove(scope)
    container.removeAttribute('data-focus-scope-unmounting')
  }, 0)
}

export interface FocusScopeKeyEvent {
  key: string
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  currentTarget: EventTarget | null
  preventDefault: () => void
}

export function handleFocusScopeKeyDown(
  event: FocusScopeKeyEvent,
  { loop, trapped, scope }: { loop: boolean; trapped: boolean; scope: FocusScopeAPI },
) {
  if ((!loop && !trapped) || scope.paused) return
  const tab = event.key === 'Tab' && !event.altKey && !event.ctrlKey && !event.metaKey
  const focused = getActiveElement()
  if (!tab || !focused) return
  const container = event.currentTarget as HTMLElement
  const [first, last] = getTabbableEdges(container)
  if (!first || !last) {
    if (focused === container) event.preventDefault()
  } else if (!event.shiftKey && focused === last) {
    event.preventDefault()
    if (loop) focus(first, { select: true })
  } else if (event.shiftKey && focused === first) {
    event.preventDefault()
    if (loop) focus(last, { select: true })
  }
}
