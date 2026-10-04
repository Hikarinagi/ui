'use client'

import { createContext, useContext, type TransitionEvent } from 'react'

export type SidebarState = 'expanded' | 'rail' | 'hidden'

export interface SidebarContextValue {
  state: SidebarState
  toggle: () => void
  openMobile: () => void
  inDrawer?: boolean
  onTransitionRun?: (event: TransitionEvent<HTMLElement>) => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)

export function useSidebar() {
  return useContext(SidebarContext)
}
