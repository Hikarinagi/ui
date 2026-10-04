'use client'

import { useCallback, useEffect, useState } from 'react'
import { pauseTimers, resumeTimers } from '../store'

export function useToastExpand() {
  const [reasons, setReasons] = useState<ReadonlySet<string>>(() => new Set())
  const expanded = reasons.size > 0

  const enter = useCallback((reason: string) => {
    setReasons(previous => (previous.has(reason) ? previous : new Set(previous).add(reason)))
    pauseTimers(reason)
  }, [])

  const leave = useCallback((reason: string) => {
    setReasons(previous => {
      if (!previous.has(reason)) return previous
      const next = new Set(previous)
      next.delete(reason)
      return next
    })
    resumeTimers(reason)
  }, [])

  useEffect(() => {
    function onVisibility() {
      if (document.hidden) pauseTimers('hidden')
      else resumeTimers('hidden')
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return { expanded, enter, leave }
}
