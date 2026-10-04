'use client'

import { createContext, useContext } from 'react'
import type { TabsVariants } from './tabs.variants'

export interface TabsStyleContextValue {
  variant: NonNullable<TabsVariants['variant']>
  size: NonNullable<TabsVariants['size']>
  orientation: NonNullable<TabsVariants['orientation']>
  highlightId: string
}

export const TabsStyleContext = createContext<TabsStyleContextValue>({
  variant: 'underline',
  size: 'md',
  orientation: 'horizontal',
  highlightId: '',
})

export function useTabsStyle(): TabsStyleContextValue {
  return useContext(TabsStyleContext)
}
