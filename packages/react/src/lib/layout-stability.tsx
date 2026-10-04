'use client'

import { createContext, useContext, type ReactNode } from 'react'

const LayoutTransitionContext = createContext<boolean | undefined>(undefined)

export function LayoutTransitionProvider({
  transitioning,
  children,
}: {
  transitioning: boolean
  children?: ReactNode
}) {
  const parent = useContext(LayoutTransitionContext)
  return (
    <LayoutTransitionContext value={!!parent || transitioning}>{children}</LayoutTransitionContext>
  )
}

export function useLayoutTransition() {
  return useContext(LayoutTransitionContext)
}
