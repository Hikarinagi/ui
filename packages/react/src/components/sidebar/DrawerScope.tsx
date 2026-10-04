'use client'

import { useMemo, useRef, type ReactNode } from 'react'
import { SidebarContext, type SidebarContextValue } from './context'

export interface DrawerScopeProps {
  close: () => void
  children?: ReactNode
}

export function DrawerScope({ close, children }: DrawerScopeProps) {
  const latest = useRef(close)
  latest.current = close
  const value = useMemo<SidebarContextValue>(
    () => ({
      state: 'expanded',
      toggle: () => latest.current(),
      openMobile: () => {},
      inDrawer: true,
    }),
    [],
  )
  return (
    <SidebarContext value={value}>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-(--hn-panel-p)">
        {children}
      </div>
    </SidebarContext>
  )
}
