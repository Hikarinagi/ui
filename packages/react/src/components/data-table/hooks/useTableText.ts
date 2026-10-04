'use client'

import { useEffect, useLayoutEffect, useState } from 'react'

export function useTableText(element: HTMLElement | null, value: string | number) {
  const [overflow, setOverflow] = useState(false)
  useEffect(() => {
    if (!element) return
    const measure = () => setOverflow(element.scrollWidth > element.clientWidth)
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure)
    observer?.observe(element)
    const fonts = element.ownerDocument.fonts
    fonts?.addEventListener('loadingdone', measure)
    return () => {
      observer?.disconnect()
      fonts?.removeEventListener('loadingdone', measure)
    }
  }, [element])
  useLayoutEffect(() => {
    if (element) setOverflow(element.scrollWidth > element.clientWidth)
  }, [element, value])
  return { overflow, tooltip: overflow ? String(value) : (false as const) }
}
