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

  const latest = useRef(visible)
  latest.current = visible

  useEffect(() => {
    if (visible === shown) return
    const wait = visible ? delay : minVisible - (performance.now() - shownAt.current)
    const timer = setTimeout(() => {
      if (latest.current !== visible) return
      if (visible) shownAt.current = performance.now()
      setShown(visible)
    }, wait)
    return () => clearTimeout(timer)
  }, [visible, shown])

  return shown
}
