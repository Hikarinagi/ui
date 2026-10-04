'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface ScrollViewportSource {
  readonly viewport?: HTMLElement
}

const MAX_FRAMES = 120

export function useScrollViewport() {
  const source = useRef<ScrollViewportSource | null>(null)
  const frame = useRef(0)
  const [viewport, setViewport] = useState<HTMLElement | undefined>(undefined)

  const read = useCallback(() => source.current?.viewport, [])

  const scrollArea = useCallback((next: ScrollViewportSource | null) => {
    cancelAnimationFrame(frame.current)
    source.current = next
    setViewport(next?.viewport)
    if (!next || next.viewport) return
    let remaining = MAX_FRAMES
    const poll = () => {
      if (source.current !== next) return
      if (next.viewport) {
        setViewport(next.viewport)
        return
      }
      if (--remaining > 0) frame.current = requestAnimationFrame(poll)
    }
    frame.current = requestAnimationFrame(poll)
  }, [])

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  return { scrollArea, viewport, read }
}
