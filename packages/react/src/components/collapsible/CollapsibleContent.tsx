'use client'

import { useComposedRefs } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { useCollapseGap } from '../../lib/collapse'
import { radixCollapsibleStyle } from '../../lib/radix/styles'
import {
  CollapsibleContent as CollapsibleContentPrimitive,
  type CollapsibleContentProps as CollapsibleContentPrimitiveProps,
} from '../../primitives/collapsible'

export interface CollapsibleContentProps extends Omit<
  CollapsibleContentPrimitiveProps,
  'as' | 'asChild' | 'forceMount' | 'onContentFound'
> {}

export function CollapsibleContent({ className, style, ref, ...attrs }: CollapsibleContentProps) {
  const content = useCollapseGap<HTMLElement>()
  const composedRef = useComposedRefs(ref, content)
  return (
    <CollapsibleContentPrimitive
      ref={composedRef}
      {...attrs}
      className={cn('hn-anim-collapse', className)}
      style={{ ...radixCollapsibleStyle, ...style }}
    />
  )
}
