'use client'

import { useRef, useState } from 'react'

export function useVModel<T>(prop: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [passive] = useState(() => prop === undefined)
  const [local, setLocal] = useState<T>(() => (prop === undefined ? defaultValue : prop))
  const [previous, setPrevious] = useState(prop)
  let current = local
  if (passive && !Object.is(previous, prop)) {
    setPrevious(prop)
    setLocal(prop as T)
    current = prop as T
  }
  const latest = useRef({ current, onChange, passive })
  latest.current = { current, onChange, passive }
  const value = passive ? current : prop === undefined ? defaultValue : prop

  function set(next: T) {
    if (latest.current.passive) setLocal(next)
    latest.current.onChange?.(next)
  }

  return [value, set] as const
}

export function isEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
  return JSON.stringify(a) === JSON.stringify(b)
}

export function isValueEqualOrExist(base: unknown, current: unknown) {
  if (base === undefined || base === null) return false
  if (Array.isArray(base)) return base.some(value => isEqual(value, current))
  return isEqual(base, current)
}
