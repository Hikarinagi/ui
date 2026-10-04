'use client'

import { useLayoutEffect } from 'react'

export function useOverlayPositionerClass(content: HTMLElement | null, className?: string) {
  useLayoutEffect(() => {
    const positioner = content?.parentElement
    const classes = className?.split(/\s+/).filter(Boolean) ?? []
    if (!positioner?.hasAttribute('data-radix-popper-content-wrapper') || !classes.length) return
    const added = classes.filter(name => !positioner.classList.contains(name))
    positioner.classList.add(...added)
    return () => positioner.classList.remove(...added)
  }, [content, className])
}
