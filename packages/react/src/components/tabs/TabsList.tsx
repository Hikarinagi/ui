'use client'

import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { TabsList as TabsListPrimitive } from '../../primitives/tabs'
import { ScrollArea, type ScrollAreaProps } from '../scroll-area/ScrollArea'
import { useTabsStyle } from './context'
import { tabsList, tabsScroll } from './tabs.variants'

export interface TabsListProps extends Omit<
  ScrollAreaProps,
  'direction' | 'scrollbar' | 'children'
> {
  label?: string
  children?: ReactNode
}

export function TabsList({ label, className, children, ...attrs }: TabsListProps) {
  const { variant, orientation } = useTabsStyle()
  return (
    <ScrollArea
      direction={orientation}
      scrollbar={false}
      {...attrs}
      className={cn(tabsScroll({ variant, orientation }), className)}
    >
      <TabsListPrimitive aria-label={label} className={cn(tabsList({ variant, orientation }))}>
        {children}
      </TabsListPrimitive>
    </ScrollArea>
  )
}
