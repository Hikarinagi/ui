'use client'

import { useCallback, useRef } from 'react'

export function useLive<V>(value: V) {
  const ref = useRef(value)
  ref.current = value
  return ref
}

export function useStableCallback<A extends unknown[], R>(callback: (...args: A) => R) {
  const ref = useRef(callback)
  ref.current = callback
  return useCallback((...args: A) => ref.current(...args), [])
}

export function useStableValue<V>(value: V): V {
  const ref = useRef(value)
  if (ref.current !== value && JSON.stringify(ref.current) !== JSON.stringify(value))
    ref.current = value
  return ref.current
}
