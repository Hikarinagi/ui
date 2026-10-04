import { cn } from '../../lib/cn'
import {
  TabsContent as TabsContentPrimitive,
  type TabsContentProps as TabsContentPrimitiveProps,
} from '../../primitives/tabs'

export interface TabsContentProps extends Omit<
  TabsContentPrimitiveProps,
  'as' | 'asChild' | 'forceMount' | 'value'
> {
  value: string
}

export function TabsContent({ value, className, ...attrs }: TabsContentProps) {
  return (
    <TabsContentPrimitive
      value={value}
      {...attrs}
      className={cn('hn-focus-ring outline-none', className)}
    />
  )
}
