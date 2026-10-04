'use client'

import { useReducer, useRef } from 'react'

export function useLatest<T>(value: T) {
  const ref = useRef(value)
  ref.current = value
  return ref
}

export function useRerender() {
  const [, rerender] = useReducer((count: number) => count + 1, 0)
  return rerender as () => void
}
