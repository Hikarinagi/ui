import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import {
  AccordionHeader,
  AccordionTrigger as AccordionTriggerPrimitive,
} from '../../primitives/accordion'
import { DisclosureIcon } from '../disclosure-icon/DisclosureIcon'
import { Ripple } from '../ripple/Ripple'
import { accordionTrigger } from './accordion.variants'

export interface AccordionTriggerProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 2 | 3 | 4 | 5 | 6
  icon?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function AccordionTrigger({
  level = 3,
  icon = true,
  className,
  children,
  ...attrs
}: AccordionTriggerProps) {
  return (
    <AccordionHeader {...attrs} as={`h${level}`} className="m-0">
      <AccordionTriggerPrimitive className={cn(accordionTrigger(), className)}>
        <Ripple />
        <span className="min-w-0 flex-1">{children}</span>
        {icon ? <DisclosureIcon>{hasContent(icon) ? icon : undefined}</DisclosureIcon> : null}
      </AccordionTriggerPrimitive>
    </AccordionHeader>
  )
}
