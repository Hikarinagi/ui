'use client'

import { useId } from 'react'
import { cn } from '../../lib/cn'
import { TabsRoot, type TabsRootProps } from '../../primitives/tabs'
import { TabsStyleContext } from './context'

export interface TabsProps extends Omit<
  TabsRootProps,
  | 'as'
  | 'asChild'
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'orientation'
  | 'dir'
  | 'activationMode'
  | 'unmountOnHide'
> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  variant?: 'underline' | 'soft'
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  variant = 'underline',
  size = 'md',
  orientation = 'horizontal',
  className,
  ...attrs
}: TabsProps) {
  const highlightId = useId()
  return (
    <TabsStyleContext value={{ variant, size, orientation, highlightId }}>
      <TabsRoot
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange as TabsRootProps['onValueChange']}
        orientation={orientation}
        {...attrs}
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-row gap-4' : 'flex-col',
          className,
        )}
      />
    </TabsStyleContext>
  )
}
