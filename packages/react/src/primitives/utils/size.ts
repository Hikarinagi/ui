'use client'

import { useState } from 'react'
import { useLayoutEffect } from './layout-effect'

export interface Size {
  width: number
  height: number
}

export function useSize(element: HTMLElement | null | undefined) {
  const [size, setSize] = useState<Size | undefined>(undefined)
  useLayoutEffect(() => {
    if (!element) {
      setSize(undefined)
      return
    }
    setSize({ width: element.offsetWidth, height: element.offsetHeight })
    const observer = new ResizeObserver(entries => {
      const entry = entries[0]
      if (!entry) return
      const border = entry.borderBoxSize?.[0]
      setSize(
        border
          ? { width: border.inlineSize, height: border.blockSize }
          : { width: element.offsetWidth, height: element.offsetHeight },
      )
    })
    observer.observe(element, { box: 'border-box' })
    return () => observer.unobserve(element)
  }, [element])
  return size
}
