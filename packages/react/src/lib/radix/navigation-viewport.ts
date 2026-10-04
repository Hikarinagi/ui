'use client'

import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

const DIMENSIONS = ['width', 'height', 'left', 'top']

function measured(element: HTMLElement | null) {
  const style = element?.style
  return DIMENSIONS.every(dimension =>
    Number.isFinite(
      Number.parseFloat(
        style?.getPropertyValue(`--radix-navigation-menu-viewport-${dimension}`) ?? '',
      ),
    ),
  )
}

export function useRadixNavigationViewport() {
  const [viewport, setViewport] = useState<HTMLElement | null>(null)
  const [ready, setReady] = useState(false)
  const update = useCallback(() => setReady(measured(viewport)), [viewport])

  useEffect(() => {
    update()
    if (!viewport) return
    const view = viewport.ownerDocument.defaultView
    if (!view) return
    const observer = new view.MutationObserver(() => flushSync(update))
    observer.observe(viewport, { attributes: true, attributeFilter: ['style'] })
    return () => observer.disconnect()
  }, [viewport, update])

  return { viewport: setViewport, ready }
}
