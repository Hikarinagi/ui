'use client'

import { useCallback, useLayoutEffect, useReducer, useRef, useState } from 'react'
import { Direction } from 'radix-ui'
import { useConfig } from '../../../lib/config'

export interface Model<T> {
  value: T
  get: () => T
  set: (next: T) => void
}

export function useVModel<T>(
  prop: T | undefined,
  onChange: ((value: T) => void) | undefined,
  defaultValue: () => T,
): Model<T> {
  const [passive] = useState(() => prop === undefined)
  const fallback = useRef<{ value: T } | null>(null)
  if (!fallback.current) fallback.current = { value: defaultValue() }
  const resolved = fallback.current
  const [proxy, setProxy] = useState<T>(() => (prop !== undefined ? prop : resolved.value))
  const [seen, setSeen] = useState(prop)
  const latest = useRef(proxy)
  const propRef = useRef(prop)
  const emit = useRef(onChange)
  emit.current = onChange
  propRef.current = prop
  let current = proxy
  if (passive && !Object.is(seen, prop)) {
    setSeen(prop)
    setProxy(prop as T)
    current = prop as T
    latest.current = current
  }

  const set = useCallback(
    (next: T) => {
      if (!passive) {
        emit.current?.(next)
        return
      }
      if (Object.is(next, latest.current)) return
      latest.current = next
      setProxy(next)
      if (next !== propRef.current) emit.current?.(next)
    },
    [passive],
  )

  const get = useCallback(() => {
    if (passive) return latest.current
    return propRef.current !== undefined ? propRef.current : resolved.value
  }, [passive, resolved])

  const value = passive ? current : prop !== undefined ? prop : resolved.value
  return { value, get, set }
}

export interface Store<T> {
  value: T
  get: () => T
  set: (next: T) => void
}

export function useStore<T>(initial: T | (() => T)): Store<T> {
  const ref = useRef<{ value: T } | null>(null)
  if (!ref.current)
    ref.current = {
      value: typeof initial === 'function' ? (initial as () => T)() : initial,
    }
  const [, force] = useReducer((count: number) => count + 1, 0)
  const holder = ref.current
  const get = useCallback(() => holder.value, [holder])
  const set = useCallback(
    (next: T) => {
      if (Object.is(holder.value, next)) return
      holder.value = next
      force()
    },
    [holder],
  )
  return { value: holder.value, get, set }
}

function changed(previous: readonly unknown[], next: readonly unknown[]) {
  return (
    previous.length !== next.length ||
    next.some((value, index) => !Object.is(value, previous[index]))
  )
}

export function useWatch<T extends readonly unknown[]>(
  sources: T,
  callback: (next: T, previous: T) => void,
) {
  const previous = useRef<T>(sources)
  const latest = useRef(callback)
  latest.current = callback
  useLayoutEffect(() => {
    if (!changed(previous.current, sources)) return
    const before = previous.current
    previous.current = sources
    latest.current(sources, before)
  })
}

export function useNextTick() {
  const queue = useRef<(() => void)[]>([])
  const [, force] = useReducer((count: number) => count + 1, 0)
  useLayoutEffect(() => {
    if (!queue.current.length) return
    const callbacks = queue.current.splice(0)
    for (const callback of callbacks) callback()
  })
  return useCallback((callback: () => void) => {
    queue.current.push(callback)
    force()
  }, [])
}

export function useLocale(locale: string | undefined) {
  const config = useConfig()
  return locale || config?.locale || 'en'
}

export function useDirection(dir: 'ltr' | 'rtl' | undefined) {
  return Direction.useDirection(dir) as 'ltr' | 'rtl'
}
