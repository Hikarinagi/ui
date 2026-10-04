'use client'

import { useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()
let observer: MutationObserver | undefined
let locked = false

function read() {
  return typeof document !== 'undefined' && document.body.style.pointerEvents === 'none'
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (!observer && typeof document !== 'undefined') {
    locked = read()
    observer = new MutationObserver(() => {
      const next = read()
      if (next === locked) return
      locked = next
      for (const notify of listeners) notify()
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size || !observer) return
    observer.disconnect()
    observer = undefined
  }
}

export function useBodyPointerLock() {
  return useSyncExternalStore(
    subscribe,
    () => (observer ? locked : read()),
    () => false,
  )
}
