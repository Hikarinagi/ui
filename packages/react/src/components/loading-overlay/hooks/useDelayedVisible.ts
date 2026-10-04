'use client'

import { useEffect, useRef, useState } from 'react'

export function useDelayedVisible(visible: boolean, delay: number, minVisible: number) {
  const shownAt = useRef(0)
  const [shown, setShown] = useState(() => {
    if (!visible || delay > 0) return false
    shownAt.current = performance.now()
    return true
  })
  const [previous, setPrevious] = useState(visible)

  if (previous !== visible) {
    setPrevious(visible)
    if (visible && !shown && delay <= 0) {
      shownAt.current = performance.now()
      setShown(true)
    } else if (!visible && shown && minVisible - (performance.now() - shownAt.current) <= 0) {
      setShown(false)
    }
  }

  const committed = useRef(shown)
  committed.current = shown

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    if (visible && !committed.current) {
      timer = setTimeout(() => {
        shownAt.current = performance.now()
        setShown(true)
      }, delay)
    } else if (!visible && committed.current) {
      const remaining = minVisible - (performance.now() - shownAt.current)
      timer = setTimeout(() => setShown(false), remaining)
    }
    return () => clearTimeout(timer)
  }, [visible])

  return shown
}
