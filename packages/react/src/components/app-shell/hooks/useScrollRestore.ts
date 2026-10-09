'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { createScrollRestoreSession } from '../../../../../shared/src/lib/scroll-restore'
import type { ScrollAreaHandle } from '../../scroll-area/ScrollArea'

export function useScrollRestore(
  key: string | undefined,
  area: RefObject<ScrollAreaHandle | null>,
) {
  const restoredKey = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!key) return
    let frame = 0
    let dispose: (() => void) | undefined

    function start() {
      const instance = area.current?.instance
      if (!instance) {
        frame = requestAnimationFrame(start)
        return
      }
      const { viewport, target } = instance.elements()
      const session = createScrollRestoreSession({
        key: key!,
        viewport,
        target,
        initial: restoredKey.current === undefined || restoredKey.current === key,
        onUpdated: listener => instance.on('updated', listener),
        onScroll: listener => instance.on('scroll', listener),
      })
      restoredKey.current = key
      dispose = session.dispose
    }

    start()
    return () => {
      cancelAnimationFrame(frame)
      dispose?.()
    }
  }, [key, area])
}
