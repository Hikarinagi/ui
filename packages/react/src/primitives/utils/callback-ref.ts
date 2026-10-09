'use client'

import { useEffect, useMemo, useRef } from 'react'

export function useCallbackRef<T extends (...args: never[]) => unknown>(callback: T | undefined) {
  const latest = useRef(callback)
  useEffect(() => {
    latest.current = callback
  })
  return useMemo(() => ((...args: Parameters<T>) => latest.current?.(...args)) as unknown as T, [])
}
