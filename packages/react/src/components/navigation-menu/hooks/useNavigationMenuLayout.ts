'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import type { NavigationMenuOrientation } from '../types'

function useElementBounding(element: HTMLElement | null) {
  const [rect, setRect] = useState({ left: 0, right: 0 })
  const update = useCallback(() => {
    const next = element ? element.getBoundingClientRect() : { left: 0, right: 0 }
    setRect(previous =>
      previous.left === next.left && previous.right === next.right
        ? previous
        : { left: next.left, right: next.right },
    )
  }, [element])

  useEffect(() => {
    update()
    if (!element) return
    const view = element.ownerDocument.defaultView
    if (!view) return
    const sync = () => flushSync(update)
    const resize = new view.ResizeObserver(sync)
    resize.observe(element)
    const mutation = new view.MutationObserver(sync)
    mutation.observe(element, { attributeFilter: ['style', 'class'] })
    view.addEventListener('scroll', sync, { capture: true, passive: true })
    view.addEventListener('resize', sync, { passive: true })
    return () => {
      resize.disconnect()
      mutation.disconnect()
      view.removeEventListener('scroll', sync, { capture: true })
      view.removeEventListener('resize', sync)
    }
  }, [element, update])

  return { left: rect.left, right: rect.right, update }
}

function useWindowWidth() {
  const [width, setWidth] = useState(Number.POSITIVE_INFINITY)
  useEffect(() => {
    setWidth(window.innerWidth)
    const update = () => flushSync(() => setWidth(window.innerWidth))
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])
  return width
}

export function useNavigationMenuLayout(
  root: HTMLElement | null,
  orientation: NavigationMenuOrientation,
  direction: 'ltr' | 'rtl',
) {
  const { left, right, update } = useElementBounding(root)
  const width = useWindowWidth()
  const [ancestors, setAncestors] = useState<HTMLElement[]>([])
  const [bounds, setBounds] = useState({ start: 16, end: width - 16 })
  const latest = useRef({ ancestors, width })
  latest.current = { ancestors, width }

  const measure = useCallback((elements = latest.current.ancestors) => {
    let start = 16
    let end = latest.current.width - 16
    for (const element of elements) {
      const overflow = element.ownerDocument.defaultView?.getComputedStyle(element).overflowX
      if (overflow === 'visible') continue
      const rect = element.getBoundingClientRect()
      start = Math.max(start, rect.left + element.clientLeft + 8)
      end = Math.min(end, rect.left + element.clientLeft + element.clientWidth - 8)
    }
    setBounds(previous =>
      previous.start === start && previous.end === end ? previous : { start, end },
    )
  }, [])

  useEffect(() => {
    const parents: HTMLElement[] = []
    for (let parent = root?.parentElement; parent; parent = parent.parentElement)
      parents.push(parent)
    setAncestors(parents)
    measure(parents)
  }, [root, measure])

  useEffect(() => {
    measure()
  }, [left, right, width, measure])

  useEffect(() => {
    const view = ancestors[0]?.ownerDocument.defaultView
    if (!view) return
    const observer = new view.ResizeObserver(() =>
      flushSync(() => {
        update()
        measure()
      }),
    )
    for (const element of ancestors) observer.observe(element)
    return () => observer.disconnect()
  }, [ancestors, update, measure])

  const before = Math.max(0, left - bounds.start - 10)
  const after = Math.max(0, bounds.end - right - 10)
  const available =
    direction === 'rtl' ? { start: after, end: before } : { start: before, end: after }
  const side: 'start' | 'end' =
    orientation === 'vertical' && available.end < 320 && available.start > available.end
      ? 'start'
      : 'end'
  const placement =
    orientation === 'horizontal'
      ? 'bottom'
      : side === 'end'
        ? direction === 'rtl'
          ? 'left'
          : 'right'
        : direction === 'rtl'
          ? 'right'
          : 'left'
  const style = root
    ? ({
        '--hn-navigation-max-width': `${orientation === 'vertical' ? available[side] : Math.max(0, bounds.end - bounds.start - 2)}px`,
        '--hn-navigation-min-x': `${bounds.start - left}px`,
        '--hn-navigation-bound-end': `${bounds.end - left}px`,
      } as CSSProperties)
    : undefined
  return { side, placement, style }
}
