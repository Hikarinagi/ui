'use client'

import { useCallback, useRef, useState } from 'react'

export function useVModel<T>(
  prop: T | undefined,
  defaultValue: T | undefined,
  onChange?: (value: T) => void,
) {
  const [passive] = useState(() => prop === undefined)
  const [internal, setInternal] = useState<T | undefined>(() => prop ?? defaultValue)
  const [previous, setPrevious] = useState(prop)
  if (passive && !Object.is(previous, prop)) {
    setPrevious(prop)
    setInternal(prop)
  }
  const value = passive ? internal : prop !== undefined ? prop : defaultValue
  const current = useRef(value)
  current.current = value
  const change = useRef(onChange)
  change.current = onChange
  const setValue = useCallback(
    (next: T) => {
      if (passive) {
        const same = Object.is(next, current.current)
        current.current = next
        setInternal(next)
        if (!same) change.current?.(next)
      } else {
        current.current = next
        change.current?.(next)
      }
    },
    [passive],
  )
  return [value, setValue] as const
}
