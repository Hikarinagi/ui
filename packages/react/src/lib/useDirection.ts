'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { useConfig } from './config'

type Direction = 'ltr' | 'rtl'

export function useDirection<T extends HTMLElement = HTMLElement>(dir: Direction | undefined) {
  const root = useRef<T>(null)
  const config = useConfig()
  const [inherited, setInherited] = useState<Direction>('ltr')
  const rootDirection = dir ?? config?.dir
  const direction = rootDirection ?? inherited

  useLayoutEffect(() => {
    const element = root.current
    const view = element?.ownerDocument.defaultView
    if (!element || !view || rootDirection) return
    const update = () => {
      setInherited(view.getComputedStyle(element).direction === 'rtl' ? 'rtl' : 'ltr')
    }
    update()
    const observer = new view.MutationObserver(update)
    for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement)
      observer.observe(ancestor, { attributes: true, attributeFilter: ['dir'] })
    return () => observer.disconnect()
  }, [rootDirection])

  return { root, direction, rootDirection }
}
