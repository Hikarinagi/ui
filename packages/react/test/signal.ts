import { useSyncExternalStore } from 'react'

export interface Signal<T> {
  value: T
  use: () => T
}

export function signal<T>(initial: T): Signal<T> {
  let current = initial
  const listeners = new Set<() => void>()
  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }
  const read = () => current
  return {
    get value() {
      return current
    },
    set value(next: T) {
      current = next
      for (const listener of [...listeners]) listener()
    },
    use: () => useSyncExternalStore(subscribe, read, read),
  }
}

export function tick() {
  return new Promise<void>(resolve => setTimeout(resolve, 0))
}
