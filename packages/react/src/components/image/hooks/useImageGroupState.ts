'use client'

import { useMemo, useReducer, useState } from 'react'
import type { LightboxItem } from '../../lightbox/types'
import type { ImageGroupContext } from '../context'

function byDom(a: LightboxItem, b: LightboxItem): number {
  const first = a.source?.()
  const second = b.source?.()
  if (
    !first ||
    !second ||
    first === second ||
    !('compareDocumentPosition' in first) ||
    !('compareDocumentPosition' in second)
  ) {
    return 0
  }
  return first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
}

export function useImageGroupState() {
  const [registry] = useState(() => new Map<string, () => LightboxItem>())
  const [version, bump] = useReducer((count: number) => count + 1, 0)
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const items = useMemo(
    () => [...registry.values()].map(read => read()).sort(byDom),
    [registry, version],
  )
  const context = useMemo<ImageGroupContext>(
    () => ({
      register: (id, item) => {
        registry.set(id, item)
        bump()
      },
      unregister: id => {
        if (registry.delete(id)) bump()
      },
      open: id => {
        const at = [...registry.values()]
          .map(read => read())
          .sort(byDom)
          .findIndex(item => item.id === id)
        if (at < 0) return
        setIndex(at)
        setOpen(true)
      },
    }),
    [registry],
  )

  return { items, open, setOpen, index, setIndex, context }
}
