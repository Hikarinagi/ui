'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ReferenceElement } from '@floating-ui/react-dom'

export interface Measurable {
  getBoundingClientRect: () => DOMRect
}

interface PopperRootContextValue {
  anchor: ReferenceElement | undefined
  onAnchorChange: (element: ReferenceElement | undefined) => void
}

const PopperRootContext = createContext<PopperRootContextValue | null>(null)

export function usePopperRootContext(consumer: string) {
  const context = useContext(PopperRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`PopperRoot\``)
  return context
}

export interface PopperRootProps {
  children?: ReactNode
}

export function PopperRoot({ children }: PopperRootProps) {
  const [anchor, setAnchor] = useState<ReferenceElement | undefined>(undefined)
  const value = useMemo<PopperRootContextValue>(
    () => ({ anchor, onAnchorChange: setAnchor }),
    [anchor],
  )
  return <PopperRootContext value={value}>{children}</PopperRootContext>
}
