export type PresenceState = 'mounted' | 'unmountSuspended' | 'unmounted'
type PresenceEvent = 'MOUNT' | 'UNMOUNT' | 'ANIMATION_OUT' | 'ANIMATION_END'
type PresenceTransition = 'enter' | 'after-enter' | 'leave' | 'after-leave'

const MACHINE: Record<PresenceState, Partial<Record<PresenceEvent, PresenceState>>> = {
  mounted: { UNMOUNT: 'unmounted', ANIMATION_OUT: 'unmountSuspended' },
  unmountSuspended: { MOUNT: 'mounted', ANIMATION_END: 'unmounted' },
  unmounted: { MOUNT: 'mounted' },
}

export function getAnimationName(node?: HTMLElement | null) {
  return node ? getComputedStyle(node).animationName || 'none' : 'none'
}

export interface PresenceController {
  readonly state: PresenceState
  readonly present: boolean
  setNode: (node: HTMLElement | null | undefined) => void
  update: (present: boolean, previous: boolean | undefined) => void
  dispose: () => void
}

export function createPresence(
  initial: boolean,
  onStateChange: (state: PresenceState) => void,
): PresenceController {
  let state: PresenceState = initial ? 'mounted' : 'unmounted'
  let present = initial
  let node: HTMLElement | null | undefined
  let styles: CSSStyleDeclaration | undefined
  let previousAnimationName = 'none'
  let timeout: number | undefined

  const ownerWindow = () => node?.ownerDocument.defaultView ?? globalThis.window

  function send(event: PresenceEvent) {
    const next = MACHINE[state][event]
    if (!next || next === state) return
    state = next
    previousAnimationName = state === 'mounted' ? getAnimationName(node) : 'none'
    onStateChange(state)
  }

  function emit(name: PresenceTransition) {
    node?.dispatchEvent(new CustomEvent(name, { bubbles: false, cancelable: false }))
  }

  function handleAnimationStart(event: AnimationEvent) {
    if (event.target === node) previousAnimationName = getAnimationName(node)
  }

  function handleAnimationEnd(event: AnimationEvent) {
    if (!node || event.target !== node) return
    const current = getAnimationName(node)
    if (current.includes(CSS.escape(event.animationName))) {
      emit(state === 'mounted' ? 'after-enter' : 'after-leave')
      send('ANIMATION_END')
      if (!present) {
        const element = node
        const fillMode = element.style.animationFillMode
        element.style.animationFillMode = 'forwards'
        timeout = ownerWindow()?.setTimeout(() => {
          if (element.style.animationFillMode === 'forwards')
            element.style.animationFillMode = fillMode
        })
      }
    }
    if (current === 'none') send('ANIMATION_END')
  }

  function detach(element: HTMLElement) {
    element.removeEventListener('animationstart', handleAnimationStart)
    element.removeEventListener('animationcancel', handleAnimationEnd)
    element.removeEventListener('animationend', handleAnimationEnd)
  }

  return {
    get state() {
      return state
    },
    get present() {
      return state === 'mounted' || state === 'unmountSuspended'
    },
    setNode(next) {
      if (next === node) return
      const previous = node
      node = next
      if (next) {
        styles = getComputedStyle(next)
        next.addEventListener('animationstart', handleAnimationStart)
        next.addEventListener('animationcancel', handleAnimationEnd)
        next.addEventListener('animationend', handleAnimationEnd)
      } else {
        send('ANIMATION_END')
        if (timeout !== undefined) ownerWindow()?.clearTimeout(timeout)
      }
      if (previous) detach(previous)
    },
    update(current, previous) {
      present = current
      if (previous === current) return
      const previousName = previousAnimationName
      const currentName = getAnimationName(node)
      if (current) {
        send('MOUNT')
        emit('enter')
        if (currentName === 'none') emit('after-enter')
      } else if (
        currentName === 'none' ||
        currentName === 'undefined' ||
        styles?.display === 'none'
      ) {
        send('UNMOUNT')
        emit('leave')
        emit('after-leave')
      } else if (previous && previousName !== currentName) {
        send('ANIMATION_OUT')
        emit('leave')
      } else {
        send('UNMOUNT')
        emit('after-leave')
      }
    },
    dispose() {
      if (node) detach(node)
      if (timeout !== undefined) ownerWindow()?.clearTimeout(timeout)
      node = undefined
    },
  }
}
