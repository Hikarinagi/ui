'use client'

import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from 'react'
import { flushSync } from 'react-dom'

export function useRenderTick() {
  const [, force] = useReducer((count: number) => count + 1, 0)
  const waiting = useRef<Array<() => void>>([])
  const queued = useRef(false)
  const alive = useRef(true)

  useLayoutEffect(() => {
    for (const resolve of waiting.current.splice(0)) resolve()
  })

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      for (const resolve of waiting.current.splice(0)) resolve()
    }
  }, [])

  return useCallback(
    () =>
      new Promise<void>(resolve => {
        waiting.current.push(resolve)
        if (queued.current) return
        queued.current = true
        queueMicrotask(() => {
          queued.current = false
          if (alive.current) flushSync(force)
          else for (const pending of waiting.current.splice(0)) pending()
        })
      }),
    [],
  )
}
