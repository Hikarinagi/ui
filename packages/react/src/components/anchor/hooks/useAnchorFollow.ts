'use client'

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { createAnchorFollow } from '../../../../../shared/src/behavior/anchor-follow'

export function useAnchorFollow(
  root: RefObject<HTMLElement | null>,
  current: string | undefined,
  lastCovered: string | undefined,
  enabled: boolean,
) {
  const [viewport, setViewport] = useState<HTMLElement>()
  const [follower] = useState(createAnchorFollow)
  const latest = useRef({ current, lastCovered, enabled })
  latest.current = { current, lastCovered, enabled }
  const state = useRef({ mounted: false, frame: 0 })

  const schedule = useRef(() => {})
  schedule.current = () => {
    if (!state.current.mounted || state.current.frame) return
    state.current.frame = requestAnimationFrame(() => {
      state.current.frame = 0
      const result = follower.follow({ nav: root.current, ...latest.current })
      if (result) setViewport(result.viewport)
    })
  }

  useLayoutEffect(() => {
    const tracked = state.current
    tracked.mounted = true
    schedule.current()
    return () => {
      tracked.mounted = false
      cancelAnimationFrame(tracked.frame)
      tracked.frame = 0
    }
  }, [])

  useLayoutEffect(() => {
    schedule.current()
  }, [current, lastCovered, enabled])

  useEffect(() => {
    const nav = root.current
    const targets = [nav, nav?.parentElement, viewport].filter((el): el is HTMLElement => !!el)
    if (!targets.length || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => schedule.current())
    for (const target of targets) observer.observe(target)
    return () => observer.disconnect()
  }, [root, viewport])
}
