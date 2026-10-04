'use client'

import { cn } from '../../lib/cn'
import {
  TabsTrigger as TabsTriggerPrimitive,
  useTabsRootContext,
  type TabsTriggerProps as TabsTriggerPrimitiveProps,
} from '../../primitives/tabs'
import { Highlight } from '../highlight/Highlight'
import { Ripple } from '../ripple/Ripple'
import { useTabsStyle } from './context'
import { tabsHighlight, tabsTrigger } from './tabs.variants'

export interface TabsTriggerProps extends Omit<
  TabsTriggerPrimitiveProps,
  'as' | 'asChild' | 'value'
> {
  value: string
}

export function TabsTrigger({ value, disabled, className, children, ...attrs }: TabsTriggerProps) {
  const { variant, size, orientation, highlightId } = useTabsStyle()
  const root = useTabsRootContext('TabsTrigger')
  const active = root.modelValue === value
  return (
    <TabsTriggerPrimitive
      value={value}
      disabled={disabled}
      {...attrs}
      className={cn(tabsTrigger({ variant, size, orientation }), className)}
    >
      {active ? (
        <Highlight
          id={highlightId}
          axis={orientation === 'vertical' ? 'y' : 'x'}
          className={tabsHighlight({ variant, orientation })}
        />
      ) : null}
      <Ripple />
      {children}
    </TabsTriggerPrimitive>
  )
}
