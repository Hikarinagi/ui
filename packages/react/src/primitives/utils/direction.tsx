'use client'

import { createContext, useContext, type ReactNode } from 'react'

export type Direction = 'ltr' | 'rtl'

const DirectionContext = createContext<Direction | undefined>(undefined)

export function DirectionProvider({ dir, children }: { dir: Direction; children?: ReactNode }) {
  return <DirectionContext value={dir}>{children}</DirectionContext>
}

export function useDirection(local?: Direction) {
  const inherited = useContext(DirectionContext)
  return local || inherited || 'ltr'
}
