'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import {
  createOverlayReference,
  type OverlayAnchor,
  type OverlayPositionStrategy,
  type OverlayReference,
} from '../../../shared/src/lib/overlay-anchor'

export * from '../../../shared/src/lib/overlay-anchor'

export function useOverlayAnchor(
  source: OverlayAnchor | null | undefined,
  open: boolean | undefined,
  present: boolean,
  strategy: OverlayPositionStrategy,
  direction?: 'ltr' | 'rtl',
) {
  const [reference, setReference] = useState<OverlayReference>()
  const latest = useRef(source)
  const current = useRef<OverlayAnchor | undefined>(undefined)
  const applied = useRef<OverlayReference | undefined>(undefined)
  latest.current = source

  useLayoutEffect(() => {
    if (!present) {
      current.current = undefined
      applied.current = undefined
      setReference(undefined)
      return
    }
    if (!source || (!open && applied.current && source !== current.current)) return
    const next = createOverlayReference(source, () => latest.current === source)
    if (!next) return
    current.current = source
    applied.current = next
    setReference(next)
  }, [source, open, present, strategy, direction])

  return reference
}
