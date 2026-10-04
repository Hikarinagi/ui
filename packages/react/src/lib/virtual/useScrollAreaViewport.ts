'use client'

import { useEffect, useState, type RefObject } from 'react'
import { flushSync } from 'react-dom'
import type { ScrollAreaHandle } from '../../components/scroll-area/ScrollArea'

export function useScrollAreaViewport(area: RefObject<ScrollAreaHandle | null>) {
  const [viewport, setViewport] = useState<HTMLElement>()

  useEffect(() => {
    let frame = requestAnimationFrame(function check() {
      const element = area.current?.viewport
      if (element) flushSync(() => setViewport(element))
      else frame = requestAnimationFrame(check)
    })
    return () => {
      cancelAnimationFrame(frame)
      setViewport(undefined)
    }
  }, [area])

  return viewport
}
