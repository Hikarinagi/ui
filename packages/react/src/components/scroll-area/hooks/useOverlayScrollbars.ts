'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import {
  OverlayScrollbars,
  type OverlayScrollbars as OSInstance,
  type PartialOptions,
} from 'overlayscrollbars'
import { useLayoutTransition } from '../../../lib/layout-stability'

type OSEvent = 'scroll' | 'updated'

export function useOverlayScrollbars(
  host: RefObject<HTMLElement | null>,
  content: RefObject<HTMLElement | null>,
  options: () => PartialOptions,
  events: Partial<Record<OSEvent, () => void>>,
  beforeInitialize?: () => void,
  attach?: (viewport: HTMLElement) => () => void,
) {
  const [instance, setInstance] = useState<OSInstance>()
  const [viewport, setViewport] = useState<HTMLElement>()
  const instanceRef = useRef<OSInstance | undefined>(undefined)
  const viewportRef = useRef<HTMLElement | undefined>(undefined)
  const latest = useRef({ options, events, beforeInitialize, attach })
  latest.current = { options, events, beforeInitialize, attach }
  const transitioning = useLayoutTransition()
  const transitioningRef = useRef(transitioning)
  transitioningRef.current = transitioning
  const paused = useRef<OSInstance | undefined>(undefined)

  useEffect(() => {
    let created: OSInstance | undefined
    let detach: (() => void) | undefined
    const frame = requestAnimationFrame(() => {
      if (!host.current || !content.current) return
      created = OverlayScrollbars(
        { target: host.current, elements: { viewport: content.current, content: content.current } },
        latest.current.options(),
      )
      created.on('scroll', () => latest.current.events.scroll?.())
      created.on('updated', () => latest.current.events.updated?.())
      latest.current.beforeInitialize?.()
      detach = latest.current.attach?.(created.elements().viewport)
      instanceRef.current = created
      viewportRef.current = created.elements().viewport
      setInstance(created)
      setViewport(created.elements().viewport)
    })
    return () => {
      cancelAnimationFrame(frame)
      paused.current = undefined
      detach?.()
      created?.destroy()
      instanceRef.current = undefined
      viewportRef.current = undefined
      setInstance(undefined)
      setViewport(undefined)
    }
  }, [host, content])

  useEffect(() => {
    const active = !!transitioning
    if (active && instance === paused.current) return
    const previous = paused.current
    paused.current = undefined
    if (previous && !previous.state().destroyed) previous.sleep(false)
    if (active && instance && !instance.state().sleeping && !instance.state().destroyed) {
      paused.current = instance
      instance.sleep(true)
    }
  }, [instance, transitioning])

  useEffect(() => {
    const element = content.current
    if (!element) return
    let frame = 0
    const update = () => {
      if (transitioningRef.current) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => instance?.update(true))
    }
    element.addEventListener('transitionend', update)
    element.addEventListener('animationend', update)
    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('transitionend', update)
      element.removeEventListener('animationend', update)
    }
  }, [content, instance])

  return { instance, viewport, instanceRef, viewportRef }
}
