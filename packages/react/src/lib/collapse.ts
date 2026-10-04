'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import {
  collapseHooks,
  writeCollapseGap,
  type CollapseAxis,
} from '../../../shared/src/lib/collapse'

export * from '../../../shared/src/lib/collapse'

export function useCollapseHooks(axis: CollapseAxis = 'y') {
  const parent = useRef<Element | null>(null)

  return useMemo(() => {
    const hooks = collapseHooks(axis, () => parent.current)
    const remember = (el: Element) => {
      parent.current = el.parentElement ?? parent.current
    }
    return {
      onBeforeEnter: (el: HTMLElement) => {
        hooks.beforeEnter(el)
        remember(el)
      },
      onAfterEnter: (el: HTMLElement) => {
        remember(el)
        hooks.afterEnter(el)
      },
      onBeforeLeave: (el: HTMLElement) => {
        remember(el)
        hooks.beforeLeave(el)
      },
    }
  }, [axis])
}

export function useCollapseGap<T extends Element = HTMLElement>() {
  const content = useRef<T | null>(null)

  useLayoutEffect(() => {
    const el = content.current
    if (el) writeCollapseGap(el, el.parentElement)
  })

  return content
}
