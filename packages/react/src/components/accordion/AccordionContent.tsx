'use client'

import { cn } from '../../lib/cn'
import { useCollapseGap } from '../../lib/collapse'
import { radixAccordionStyle } from '../../lib/radix/styles'
import {
  AccordionContent as AccordionContentPrimitive,
  type AccordionContentProps as AccordionContentPrimitiveProps,
} from '../../primitives/accordion'
import { accordionContent } from './accordion.variants'
import { useComposedRefs } from '../../primitives/utils/compose-refs'

export interface AccordionContentProps extends Omit<
  AccordionContentPrimitiveProps,
  'as' | 'asChild' | 'forceMount'
> {}

export function AccordionContent({
  className,
  style,
  children,
  ref,
  ...attrs
}: AccordionContentProps) {
  const content = useCollapseGap<HTMLElement>()
  const composedRef = useComposedRefs(ref, content)
  return (
    <AccordionContentPrimitive
      ref={composedRef}
      {...attrs}
      className={cn(accordionContent(), className)}
      style={{ ...radixAccordionStyle, ...style }}
    >
      <div className="pb-4">{children}</div>
    </AccordionContentPrimitive>
  )
}
